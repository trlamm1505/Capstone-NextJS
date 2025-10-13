import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { fetchRoomDetail, setRoomFromNavigation } from "./slice";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

type LocationState = {
    room?: {
        id: number;
        tenPhong: string;
        moTa: string;
        giaTien: number;
        hinhAnh: string;
        khach: number;
        phongNgu: number;
        giuong: number;
        phongTam: number;
    };
    city?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
};

type PendingBooking = {
    roomId: number;
    checkIn: string;
    checkOut: string;
    guests: number;
    redirect: string;
};

type Booking = {
    id: number;
    maPhong: number;
    ngayDen: string;
    ngayDi: string;
    soLuongKhach: number;
    maNguoiDung: number;
};

type RoomReview = {
    id: number;
    ngayBinhLuan: string;
    noiDung: string;
    saoBinhLuan: number;
    tenNguoiBinhLuan: string;
    avatar?: string;
};

export default function RoomDetail() {
    const { id } = useParams();
    const { state } = useLocation() as { state: LocationState };
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { room, loading, error } = useSelector((s: RootState) => s.roomDetail);
    const { isAuthenticated, user } = useSelector((s: any) => s.login || { isAuthenticated: false, user: null });

    const [checkIn, setCheckIn] = useState<string>(state?.checkIn || "");
    const [checkOut, setCheckOut] = useState<string>(state?.checkOut || "");
    const [guests, setGuests] = useState<number>(state?.guests ? parseInt(state.guests, 10) : 1);
    const [conflictOpen, setConflictOpen] = useState<boolean>(false);
    const [reviews, setReviews] = useState<RoomReview[]>([]);
    const [showAllReviews, setShowAllReviews] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");
    const [rating, setRating] = useState<number>(5);
    const [guestError, setGuestError] = useState<string>("");

    const nights = useMemo(() => {
        if (!checkIn || !checkOut) return 0;
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const diff = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    }, [checkIn, checkOut]);

    // Hàm xử lý thay đổi số lượng khách với validation
    const handleGuestsChange = (value: number) => {
        if (!room) return;
        
        if (value < 1) {
            setGuests(1);
            setGuestError("");
        } else if (value > room.khach) {
            setGuestError(`Phòng này chỉ cho phép tối đa ${room.khach} khách`);
            setGuests(room.khach);
        } else {
            setGuests(value);
            setGuestError("");
        }
    };

    const bookRoom = async (): Promise<void> => {
        if (!room || !checkIn || !checkOut || nights <= 0) return;
        const res = await api.get("/dat-phong");
        const bookings = (res?.data?.content ?? []) as Booking[];
        const inMs = new Date(checkIn).getTime();
        const outMs = new Date(checkOut).getTime();
        const overlap = bookings.some((b: Booking) => {
            if (Number(b.maPhong) !== Number(room.id)) return false;
            const bIn = new Date(b.ngayDen).getTime();
            const bOut = new Date(b.ngayDi).getTime();
            return inMs < bOut && outMs > bIn;
        });
        if (overlap) {
            try { localStorage.removeItem('pendingBooking'); } catch { }
            navigate('/dat-phong-thanh-cong', {
                state: {
                    alreadyBooked: true,
                    checkIn,
                    checkOut,
                    guests,
                    roomName: room.tenPhong,
                    backUrl: `/chi-tiet-phong/${room.id}`,
                },
                replace: true,
            });
            return;
        }
        const resCreate = await api.post("/dat-phong", {
            id: 0,
            maPhong: room.id,
            ngayDen: new Date(checkIn).toISOString(),
            ngayDi: new Date(checkOut).toISOString(),
            soLuongKhach: guests,
            maNguoiDung: user?.id ?? 0,
        });
        try { localStorage.removeItem('pendingBooking'); } catch { }
        navigate('/dat-phong-thanh-cong', {
            state: {
                bookingId: resCreate?.data?.content?.id ?? undefined,
                checkIn,
                checkOut,
                guests,
                roomName: room.tenPhong,
                backUrl: `/chi-tiet-phong/${room.id}`,
            },
            replace: true,
        });
    };

    useEffect(() => {
        if (state?.room) {
            dispatch(setRoomFromNavigation(state.room as any));
        } else if (id) {
            dispatch(fetchRoomDetail(Number(id)));
        }
    }, [dispatch, id, state?.room]);

    // Load reviews for this room and keep newest first
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                if (!id) return;
                const res = await api.get(`/binh-luan/lay-binh-luan-theo-phong/${id}`);
                const list = (res?.data?.content ?? []) as any[];
                const parsed: RoomReview[] = list
                    .map((r: any) => ({
                        id: r.id,
                        ngayBinhLuan: r.ngayBinhLuan,
                        noiDung: r.noiDung,
                        saoBinhLuan: Number(r.saoBinhLuan ?? 0),
                        tenNguoiBinhLuan: r.tenNguoiBinhLuan,
                        avatar: r.avatar,
                    }))
                    .reverse();
                setReviews(parsed);
            } catch (_) {
                setReviews([]);
            }
        };
        fetchReviews();
    }, [id]);

    // After redirect from login: if we saved a pending booking for this room, auto-fill and try booking
    useEffect(() => {
        try {
            const pendingStr = localStorage.getItem('pendingBooking');
            if (!pendingStr) return;
            const pending = JSON.parse(pendingStr) as PendingBooking;
            if (pending?.roomId && String(pending.roomId) === String(id)) {
                setCheckIn(pending.checkIn || '');
                setCheckOut(pending.checkOut || '');
                setGuests(pending.guests || 1);
                // Nếu đã đăng nhập sẵn, tự động đặt ngay
                if (isAuthenticated && room && pending.checkIn && pending.checkOut) {
                    bookRoom();
                }
            }
        } catch { }
    }, [id, isAuthenticated, room]);

    // Auto-book right after login when returning with pendingBooking
    useEffect(() => {
        try {
            const pendingStr = localStorage.getItem('pendingBooking');
            if (!pendingStr) return;
            const pending = JSON.parse(pendingStr);
            if (pending?.roomId && String(pending.roomId) === String(id) && isAuthenticated && room && checkIn && checkOut) {
                bookRoom();
            }
        } catch { }
    }, [isAuthenticated, room, checkIn, checkOut, id]);

    // Auto-submit saved comment after login
    useEffect(() => {
        const run = async () => {
            try {
                const raw = localStorage.getItem('pendingComment');
                if (!raw || !isAuthenticated || !id) return;
                const pc = JSON.parse(raw) as { roomId: number; content: string; rating: number };
                if (String(pc.roomId) !== String(id) || !pc.content) return;
                await api.post('/binh-luan', {
                    id: 0,
                    maPhong: Number(id),
                    maNguoiBinhLuan: (user?.id ?? user?._id ?? user?.userId ?? 0),
                    ngayBinhLuan: new Date().toISOString(),
                    noiDung: pc.content,
                    saoBinhLuan: pc.rating ?? 5,
                }, { headers: { token: (user?.token || user?.accessToken || '') } });
                localStorage.removeItem('pendingComment');
                const res = await api.get(`/binh-luan/lay-binh-luan-theo-phong/${id}`);
                const list = (res?.data?.content ?? []) as any[];
                const parsed: RoomReview[] = list.map((r: any) => ({
                    id: r.id,
                    ngayBinhLuan: r.ngayBinhLuan,
                    noiDung: r.noiDung,
                    saoBinhLuan: Number(r.saoBinhLuan ?? 0),
                    tenNguoiBinhLuan: r.tenNguoiBinhLuan,
                    avatar: r.avatar,
                })).sort((a, b) => new Date(b.ngayBinhLuan).getTime() - new Date(a.ngayBinhLuan).getTime());
                setReviews(parsed);
            } catch { }
        };
        run();
    }, [isAuthenticated, id]);

    return (
        <>
            <div className="mx-auto w-full max-w-[1100px] px-4 lg:px-6 py-6">
                <h1 className="text-2xl font-bold mb-4">{room?.tenPhong || `Chi tiết phòng #${id}`}</h1>
                {loading && <div>Đang tải thông tin phòng...</div>}
                {error && <div className="text-red-500">{error}</div>}
                {room ? (
                    <>
                        <div>
                            <img src={room.hinhAnh} alt={room.tenPhong} className="w-full h-[520px] object-cover rounded-2xl" />
                            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <div className="text-gray-600 mb-2">{room.moTa}</div>
                                    <div className="text-gray-700 mb-2">
                                        {room.khach} khách · {room.phongNgu} phòng ngủ · {room.giuong} giường · {room.phongTam} phòng tắm
                                    </div>
                                    {/* Tiện nghi */}
                                    <div className="mt-6">
                                        <h3 className="font-semibold mb-3 text-lg">Tiện nghi</h3>
                                        <div className="grid grid-cols-2 gap-4 text-base">
                                            {[
                                                { key: "wifi", label: "Wifi", icon: "📶" },
                                                { key: "bep", label: "Bếp", icon: "🍳" },
                                                { key: "dieuHoa", label: "Điều hòa", icon: "❄️" },
                                                { key: "tivi", label: "TV", icon: "📺" },
                                                { key: "mayGiat", label: "Máy giặt", icon: "🧺" },
                                                { key: "banLa", label: "Bàn là", icon: "🧼" },
                                                { key: "banUi", label: "Bàn ủi", icon: "🧴" },
                                                { key: "doXe", label: "Chỗ đỗ xe", icon: "🚗" },
                                                { key: "hoBoi", label: "Hồ bơi", icon: "🏊" },
                                            ].map((amenity) => {
                                                const value = (room as any)[amenity.key];
                                                if (!value) return null;
                                                return (
                                                    <div key={amenity.key} className="flex items-center gap-3">
                                                        <span className="text-2xl" aria-hidden>
                                                            {amenity.icon}
                                                        </span>
                                                        <span className="font-medium">{amenity.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {state?.city && (
                                        <div className="text-sm text-gray-500 mt-2">Khu vực: {state.city}</div>
                                    )}
                                    {(state?.checkIn || state?.checkOut) && (
                                        <div className="text-sm text-gray-500">{state.checkIn} - {state.checkOut}</div>
                                    )}
                                </div>
                                {/* Booking card */}
                                <div className="rounded-2xl border p-4 h-max lg:sticky lg:top-24">
                                    <div className="flex items-baseline justify-between mb-3">
                                        <div className="text-2xl font-semibold">${room.giaTien} <span className="text-base font-normal">/ đêm</span></div>
                                    </div>
                                    <div className="text-xl font-semibold mb-3">Đặt phòng</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Nhận phòng</label>
                                            <input type="date" className="w-full rounded-lg border px-3 py-2" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Trả phòng</label>
                                            <input type="date" className="w-full rounded-lg border px-3 py-2" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-500 mb-1">Khách</label>
                                            <input 
                                                type="number" 
                                                min={1} 
                                                max={room.khach}
                                                className={`w-full rounded-lg border px-3 py-2 ${guestError ? 'border-red-500' : ''}`} 
                                                value={guests} 
                                                onChange={(e) => handleGuestsChange(parseInt(e.target.value || "1", 10))} 
                                            />
                                            {guestError && (
                                                <div className="text-red-500 text-xs mt-1">{guestError}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3 text-sm text-gray-700">
                                        {nights > 0 ? (
                                            <>
                                                <div>{nights} đêm x ${room.giaTien} = <span className="font-semibold">${nights * room.giaTien}</span></div>
                                            </>
                                        ) : (
                                            <div>Chọn ngày để tính tổng tiền</div>
                                        )}
                                    </div>
                                    <button
                                        className={`mt-4 w-full rounded-xl py-3 text-white font-semibold ${
                                            guestError || guests > (room?.khach || 0) 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-rose-500 hover:bg-rose-600'
                                        }`}
                                        disabled={guestError !== "" || guests > (room?.khach || 0)}
                                        onClick={async () => {
                                            if (guestError || guests > (room?.khach || 0)) return;
                                            
                                            if (!isAuthenticated) {
                                                try {
                                                    if (room) {
                                                        localStorage.setItem(
                                                            "pendingBooking",
                                                            JSON.stringify({
                                                                roomId: room.id,
                                                                checkIn,
                                                                checkOut,
                                                                guests,
                                                                redirect: window.location.pathname + window.location.search,
                                                            })
                                                        );
                                                    }
                                                } catch { }
                                                navigate(`/dangnhap?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
                                                return;
                                            }
                                            await bookRoom();
                                        }}
                                    >
                                        Đặt phòng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
            {/* Reviews and Comments Section */}
            <div className="mx-auto w-full max-w-[1100px] px-4 lg:px-6 pb-12">
                {/* Reviews Section - chỉ hiển thị khi có reviews */}
                {reviews.length > 0 && (
                    <>
                        <h3 className="text-xl font-semibold mb-4">Đánh giá của khách</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(showAllReviews ? reviews : reviews.slice(0, 4)).map((rv) => (
                                <div key={rv.id} className="rounded-2xl border p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <img src={rv.avatar || "data:image/svg+xml;utf8,<?xml version='1.0' encoding='UTF-8'?><svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><rect width='100%' height='100%' fill='%23f1f5f9'/><circle cx='30' cy='22' r='10' fill='%23cbd5e1'/><rect x='15' y='38' width='30' height='8' rx='4' fill='%23cbd5e1'/></svg>"} alt={rv.tenNguoiBinhLuan} className="h-10 w-10 rounded-full object-cover bg-slate-100" />
                                        <div>
                                            <div className="font-semibold">{rv.tenNguoiBinhLuan}</div>
                                            <div className="text-xs text-gray-500">{new Date(rv.ngayBinhLuan).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-yellow-500 mb-2">{"★".repeat(rv.saoBinhLuan)}{"☆".repeat(Math.max(0, 5 - rv.saoBinhLuan))}</div>
                                    <div className="text-sm text-gray-700 whitespace-pre-wrap break-all break-words">{rv.noiDung}</div>
                                </div>
                            ))}
                        </div>
                        {reviews.length > 4 && (
                            <div className="mt-4 text-center">
                                <button
                                    className="inline-flex items-center rounded-full border px-4 py-2 text-sm hover:bg-black/5"
                                    onClick={() => setShowAllReviews((v) => !v)}
                                >
                                    {showAllReviews ? "Ẩn bớt" : "Hiển thị thêm"}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Add comment section - luôn hiển thị */}
                <div className={`${reviews.length > 0 ? 'mt-8' : ''}`}>
                    <h4 className="font-medium mb-2">Thêm bình luận</h4>
                    <div className="flex items-start gap-3">
                        <img src={(user?.avatar || "data:image/svg+xml;utf8,<?xml version='1.0' encoding='UTF-8'?><svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect width='100%' height='100%' fill='%23f1f5f9'/><circle cx='20' cy='14' r='7' fill='%23cbd5e1'/><rect x='8' y='26' width='24' height='6' rx='3' fill='%23cbd5e1'/></svg>") as string} alt="avatar" className="h-10 w-10 rounded-full object-cover bg-slate-100" />
                        <div className="flex-1">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="w-full rounded-xl border px-3 py-2 min-h-[140px]"
                                placeholder="Chia sẻ trải nghiệm của bạn..."
                            />
                            <div className="mt-2 flex items-center justify-between">
                                <div className="text-sm">
                                    <span className="mr-2">Đánh giá:</span>
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button key={n} type="button" className={`mx-0.5 ${rating >= n ? 'text-yellow-500' : 'text-gray-300'}`} onClick={() => setRating(n)}>★</button>
                                    ))}
                                </div>
                                <button
                                    className="rounded-lg bg-rose-500 px-4 py-2 text-white hover:bg-rose-600 text-sm"
                                    onClick={async () => {
                                        if (!isAuthenticated) {
                                            try {
                                                localStorage.setItem('pendingComment', JSON.stringify({ roomId: Number(id), content: comment.trim(), rating }));
                                            } catch { }
                                            navigate(`/dangnhap?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
                                            return;
                                        }
                                        if (!comment.trim() || !id) return;
                                        try {
                                            await api.post('/binh-luan', {
                                                id: 0,
                                                maPhong: Number(id),
                                                maNguoiBinhLuan: (user?.id ?? user?._id ?? user?.userId ?? 0),
                                                ngayBinhLuan: new Date().toISOString(),
                                                noiDung: comment.trim(),
                                                saoBinhLuan: rating,
                                            }, { headers: { token: (user?.token || user?.accessToken || '') } });
                                            setComment("");
                                            const res = await api.get(`/binh-luan/lay-binh-luan-theo-phong/${id}`);
                                            const list = (res?.data?.content ?? []) as any[];
                                            const parsed: RoomReview[] = list.map((r: any) => ({
                                                id: r.id,
                                                ngayBinhLuan: r.ngayBinhLuan,
                                                noiDung: r.noiDung,
                                                saoBinhLuan: Number(r.saoBinhLuan ?? 0),
                                                tenNguoiBinhLuan: r.tenNguoiBinhLuan,
                                                avatar: r.avatar,
                                            })).sort((a, b) => new Date(b.ngayBinhLuan).getTime() - new Date(a.ngayBinhLuan).getTime());
                                            setReviews(parsed);
                                        } catch (e: any) {
                                            alert(e?.response?.data?.message || e?.message || 'Gửi bình luận thất bại');
                                        }
                                    }}
                                >
                                    Gửi bình luận
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                conflictOpen ? (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md text-center">
                            <div className="text-lg font-semibold mb-2">Khoảng thời gian đã có người đặt</div>
                            <p className="text-gray-600 mb-4">Vui lòng chọn thời gian khác hoặc quay lại.</p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={() => { setConflictOpen(false); navigate('/'); }} className="px-4 py-2 rounded-lg border">Về trang chủ</button>
                                <button onClick={() => setConflictOpen(false)} className="px-4 py-2 rounded-lg bg-rose-500 text-white">Ở lại trang chi tiết</button>
                            </div>
                        </div>
                    </div>
                ) : null

            }
        </>
    );
}


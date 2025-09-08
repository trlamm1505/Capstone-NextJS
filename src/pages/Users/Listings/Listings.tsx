import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import { fetchRoomsByLocation } from './slice';

export default function Listings() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const maViTri = params.get('maViTri');
    const city = params.get('city') || '';
    const checkIn = params.get('checkIn') || '';
    const checkOut = params.get('checkOut') || '';
    const dispatch = useDispatch<AppDispatch>();
    const { rooms, loading, error } = useSelector((s: any) => s.listings);

    useEffect(() => {
        if (maViTri) {
            dispatch(fetchRoomsByLocation(Number(maViTri)));
        }
    }, [maViTri, dispatch]);

    const mapQuery = encodeURIComponent(city || 'Việt Nam');
    const mapUrl = `https://www.google.com/maps?q=${mapQuery}&hl=vi&z=12&output=embed`;

    return (
        <div className="mx-auto w-full max-w-[1400px] px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <style>{`
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
              .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
            {/* Left: scrollable list */}
            <div className="no-scrollbar lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto pr-4">
                <div className="sticky top-0 z-10 bg-white py-2 shadow-sm">
                    <div className="mb-1 text-sm text-gray-500">
                        {rooms.length > 0 && (
                            <>
                                Hơn {rooms.length} chỗ •{checkIn && checkOut ? ` ${checkIn} - ${checkOut}` : ''}
                            </>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Chỗ ở tại khu vực bạn đã chọn</h1>
                    <div className="flex flex-wrap gap-2">
                        <button className="rounded-full border px-3 py-1 text-sm">Loại nơi ở</button>
                        <button className="rounded-full border px-3 py-1 text-sm">Giá</button>
                        <button className="rounded-full border px-3 py-1 text-sm">Đặt ngay</button>
                        <button className="rounded-full border px-3 py-1 text-sm">Phòng và phòng ngủ</button>
                        <button className="rounded-full border px-3 py-1 text-sm">Bộ lọc khác</button>
                    </div>
                </div>
                {loading && <div className="py-6">Đang tải phòng...</div>}
                {error && <div className="text-red-500">{error}</div>}
                {!loading && !error && rooms.length === 0 && (
                    <div className="py-10 text-gray-600">
                        Không tìm thấy chỗ ở phù hợp. Hãy thử điều chỉnh bộ lọc hoặc chọn khu vực khác.
                    </div>
                )}
                <div className="space-y-4">
                    {rooms.map((room: any) => (
                        <div
                            key={room.id}
                            className="flex flex-col lg:flex-row gap-3 lg:gap-4 rounded-2xl border p-3 lg:p-4 bg-white cursor-pointer hover:shadow-md transition"
                            onClick={() =>
                                navigate(`/chi-tiet-phong/${room.id}` as const, {
                                    state: { room, city, checkIn, checkOut },
                                })
                            }
                        >
                            <img
                                src={room.hinhAnh}
                                alt={room.tenPhong}
                                className="w-full h-48 lg:h-40 lg:w-64 rounded-xl object-cover"
                            />
                            <div className="min-w-0">
                                <div className="text-xs lg:text-sm text-gray-500 mb-1 line-clamp-2">{room.moTa}</div>
                                <div className="font-semibold text-base lg:text-lg">{room.tenPhong}</div>
                                <div className="text-sm text-gray-600">
                                    {room.khach} khách · {room.phongNgu} phòng ngủ · {room.giuong} giường · {room.phongTam} phòng tắm
                                </div>
                                <div className="font-semibold mt-1">${room.giaTien} / đêm</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Right: sticky map */}
            <div className="hidden lg:block">
                <div className="sticky top-20 h-[calc(100vh-120px)] w-full overflow-hidden rounded-2xl relative">
                    <iframe
                        title="map"
                        src={mapUrl}
                        className="absolute inset-0 w-full h-full block"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </div>
    );
}

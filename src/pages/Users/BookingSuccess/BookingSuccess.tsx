
import { useLocation, useNavigate } from "react-router-dom";

type BookingSuccessState = {
    bookingId?: string | number;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    roomName?: string;
    backUrl?: string;
    alreadyBooked?: boolean;
};

export default function BookingSuccess() {
    const navigate = useNavigate();
    const { state } = useLocation() as { state: BookingSuccessState };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border p-6 text-center shadow-lg bg-white">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</div>
                <h1 className="text-xl font-semibold mb-1">
                    {state?.alreadyBooked ? 'Phòng đã được đặt trước đó' : 'Đặt phòng thành công!'}
                </h1>
                <p className="text-gray-600 mb-4">
                    {state?.alreadyBooked
                        ? 'Khoảng thời gian bạn chọn đã có người đặt. Bạn có thể chọn thời gian khác hoặc quay về chi tiết phòng.'
                        : 'Cảm ơn bạn. Chúng tôi đã ghi nhận đặt phòng của bạn.'}
                </p>

                <div className="rounded-xl bg-gray-50 p-4 text-left text-sm mb-4">
                    {state?.roomName && <div className="mb-1"><span className="text-gray-500">Phòng: </span><span className="font-medium">{state.roomName}</span></div>}
                    {!state?.alreadyBooked && state?.bookingId && (
                        <div className="mb-1"><span className="text-gray-500">Mã đặt: </span><span className="font-mono">{String(state.bookingId)}</span></div>
                    )}
                    {(state?.checkIn || state?.checkOut) && (
                        <div className="mb-1"><span className="text-gray-500">Thời gian: </span>{state?.checkIn} → {state?.checkOut}</div>
                    )}
                    {typeof state?.guests === 'number' && <div><span className="text-gray-500">Khách: </span>{state.guests}</div>}
                </div>

                <div className="flex gap-3 justify-center">
                    <button onClick={() => navigate('/')} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Về trang chủ</button>
                    <button onClick={() => navigate(state?.backUrl || '/')} className="px-4 py-2 rounded-lg border">Xem lại chi tiết phòng</button>
                </div>
            </div>
        </div>
    );
}



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import api from "../../../services/api";

export type Room = {
    id: number;
    tenPhong: string;
    khach: number;
    phongNgu: number;
    giuong: number;
    phongTam: number;
    moTa: string;
    giaTien: number;
    hinhAnh: string;
};

export type ListingsState = {
    loading: boolean;
    error: string | null;
    rooms: Room[];
};

const initialState: ListingsState = {
    loading: false,
    error: null,
    rooms: [],
};

// Hàm kiểm tra xem phòng có bị trùng lịch không
const isRoomAvailable = (room: Room, bookings: any[], checkIn: string, checkOut: string): boolean => {
    if (!checkIn || !checkOut) return true;
    
    const inMs = new Date(checkIn).getTime();
    const outMs = new Date(checkOut).getTime();
    
    return !bookings.some((booking: any) => {
        if (Number(booking.maPhong) !== Number(room.id)) return false;
        const bIn = new Date(booking.ngayDen).getTime();
        const bOut = new Date(booking.ngayDi).getTime();
        return inMs < bOut && outMs > bIn;
    });
};

// Hàm kiểm tra xem phòng có đủ sức chứa không
const isRoomCapacitySufficient = (room: Room, guests: string): boolean => {
    if (!guests) return true;
    const guestCount = parseInt(guests, 10);
    return guestCount <= room.khach;
};

export const fetchRoomsByLocation = createAsyncThunk<
    Room[],
    { maViTri: number; checkIn?: string; checkOut?: string; guests?: string },
    { rejectValue: string }
>("listings/fetchRoomsByLocation", async ({ maViTri, checkIn, checkOut, guests }, { rejectWithValue }) => {
    try {
        // Lấy danh sách phòng theo vị trí
        const res = await api.get("/phong-thue/lay-phong-theo-vi-tri", { params: { maViTri } });
        const rooms = res?.data?.content ?? [];
        
        // Nếu không có thông tin lọc, trả về tất cả phòng
        if (!checkIn || !checkOut) {
            return rooms.filter((room: Room) => isRoomCapacitySufficient(room, guests || ''));
        }
        
        // Lấy danh sách booking để kiểm tra lịch trống
        const bookingsRes = await api.get("/dat-phong");
        const bookings = bookingsRes?.data?.content ?? [];
        
        // Lọc phòng dựa trên ngày và số khách
        const filteredRooms = rooms.filter((room: Room) => {
            const isAvailable = isRoomAvailable(room, bookings, checkIn, checkOut);
            const hasCapacity = isRoomCapacitySufficient(room, guests || '');
            return isAvailable && hasCapacity;
        });
        
        return filteredRooms as Room[];
    } catch (err) {
        const error = err as AxiosError<any>;
        const data = error.response?.data as any;
        const message = data?.message || (typeof data === "string" ? data : undefined) || error.message || "Không tải được phòng";
        return rejectWithValue(message);
    }
});

const listingsSlice = createSlice({
    name: "listings",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoomsByLocation.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.rooms = [];
            })
            .addCase(fetchRoomsByLocation.fulfilled, (state, action: PayloadAction<Room[]>) => {
                state.loading = false;
                state.rooms = action.payload;
            })
            .addCase(fetchRoomsByLocation.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload ?? "Không tải được phòng";
            });
    },
});

export default listingsSlice.reducer;

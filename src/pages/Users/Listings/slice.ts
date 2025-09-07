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

export const fetchRoomsByLocation = createAsyncThunk<
    Room[],
    number,
    { rejectValue: string }
>("listings/fetchRoomsByLocation", async (maViTri, { rejectWithValue }) => {
    try {
        const res = await api.get("/phong-thue/lay-phong-theo-vi-tri", { params: { maViTri } });
        const content = res?.data?.content ?? [];
        return content as Room[];
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

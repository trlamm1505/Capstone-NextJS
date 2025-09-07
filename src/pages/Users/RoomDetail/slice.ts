import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import api from "../../../services/api";

export type RoomDetail = {
    id: number;
    tenPhong: string;
    moTa: string;
    giaTien: number;
    hinhAnh: string;
    khach: number;
    phongNgu: number;
    giuong: number;
    phongTam: number;
    mayGiat?: boolean;
    banLa?: boolean;
    tivi?: boolean;
    dieuHoa?: boolean;
    wifi?: boolean;
    bep?: boolean;
    doXe?: boolean;
    hoBoi?: boolean;
    [key: string]: any;
};

export type RoomDetailState = {
    loading: boolean;
    error: string | null;
    room: RoomDetail | null;
};

const initialState: RoomDetailState = {
    loading: false,
    error: null,
    room: null,
};

export const fetchRoomDetail = createAsyncThunk<
    RoomDetail,
    number,
    { rejectValue: string }
>("roomDetail/fetchRoomDetail", async (id, { rejectWithValue }) => {
    try {
        // Attempt common REST pattern first
        try {
            const res = await api.get(`/phong-thue/${id}`);
            return (res?.data?.content ?? res?.data) as RoomDetail;
        } catch (_) {
            // Fallback: fetch all and find by id
            const resAll = await api.get("/phong-thue");
            const list: RoomDetail[] = resAll?.data?.content ?? [];
            const found = list.find((r) => Number(r.id) === Number(id));
            if (!found) throw new Error("Không tìm thấy phòng");
            return found;
        }
    } catch (err) {
        const error = err as AxiosError<any>;
        const data = error.response?.data as any;
        const message = data?.message || (typeof data === "string" ? data : undefined) || error.message || "Không tải được chi tiết phòng";
        return rejectWithValue(message);
    }
});

const roomDetailSlice = createSlice({
    name: "roomDetail",
    initialState,
    reducers: {
        setRoomFromNavigation(state, action: PayloadAction<RoomDetail>) {
            state.room = action.payload;
            state.error = null;
            state.loading = false;
        },
        clearRoom(state) {
            state.room = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoomDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoomDetail.fulfilled, (state, action: PayloadAction<RoomDetail>) => {
                state.loading = false;
                state.room = action.payload;
            })
            .addCase(fetchRoomDetail.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload ?? "Không tải được chi tiết phòng";
            });
    },
});

export const { setRoomFromNavigation, clearRoom } = roomDetailSlice.actions;
export default roomDetailSlice.reducer;





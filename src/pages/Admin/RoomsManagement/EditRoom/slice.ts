import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../../services/api";
import type { RoomResponse, EditFormData } from "../../types/Room";

interface RoomState {
    loading: boolean;
    room: any | null;
    message: string | null;
    success: boolean | null;
}

const initialState: RoomState = {
    loading: false,
    room: null,
    message: null,
    success: false
}

export const fetchRoomById = createAsyncThunk<RoomResponse, String, { rejectValue: string }>(
    "rooms/detail",
    async (id, { rejectWithValue }) => {
        try {
            console.log('fetchRoomById API data:', id);
            const response = await api.get<RoomResponse>(`phong-thue/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('fetchRoomById API error:', error);
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Thêm phòng thất bại";
            return rejectWithValue(errorMessage);
        }
    }
);

export const editRoom = createAsyncThunk<RoomResponse, EditFormData, { rejectValue: string }>(
    "rooms/editRoom",
    async ({id, data}, { rejectWithValue }) => {
        try {
            console.log('editRoom API data:', data);
            const response = await api.put<RoomResponse>(`phong-thue/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error('editRoom API error:', error);
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Thêm phòng thất bại";
            return rejectWithValue(errorMessage);
        }
    }
);

const roomSlice = createSlice({
    name: "rooms",
    initialState,
    reducers: {
        clearError: (state) => {
            state.message = null;
        },
        resetRoom: (state) => {
            state.room = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchRoomById.pending, (state) => {
                state.loading = true;
                state.message = null;
                state.success = false;
            })
            .addCase(fetchRoomById.fulfilled, (state, action) => {
                state.loading = false;
                state.room = action.payload.content;
                state.message = action.payload.message
                state.success = true;
            })
            .addCase(fetchRoomById.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload || "Lấy danh sách phòng thất bại";
            })
            .addCase(editRoom.pending, (state) => {
                state.loading = true;
                state.message = null;
                state.success = false;
            })
            .addCase(editRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.room = action.payload.content;
                state.message = action.payload.message
                state.success = true;
            })
            .addCase(editRoom.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload || "Cập nhật phòng thất bại";
            });
    }
});

export const { clearError, resetRoom } = roomSlice.actions;
export default roomSlice.reducer;

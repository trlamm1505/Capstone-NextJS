import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../../services/api";
import type { RoomResponse } from "../../types/Room";

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
            });
    }
});

export const { clearError, resetRoom } = roomSlice.actions;
export default roomSlice.reducer;


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../../services/api"
import type { BookingFormValues } from "./BookRoom"

interface BookingRoomState {
    loading: boolean
    bookRoom: any | null
    bookRooms: any[] | null
    message: string | null
    success: boolean | null
}
const initialState: BookingRoomState = {
    loading: false,
    bookRoom: null,
    bookRooms: null,
    message: null,
    success: false,
}

export const getBookRoom = createAsyncThunk<any, void, { rejectValue: string }>(
    "lay-phong-thue",
    async (_args, { rejectWithValue }) => {
        try {
            console.log('bookRoom pagination:')
            const response = await api.get("dat-phong")
            return response.data
        } catch (error: any) {
            console.error('bookRoom API error:', error)
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Lấy danh sách phòng nghỉ dưỡng thất bại"
            return rejectWithValue(errorMessage)
        }
    }
)

export const bookRoom = createAsyncThunk<any, BookingFormValues, { rejectValue: string }>(
    "dat-phong-thue",
    async (data, { rejectWithValue }) => {
        try {
            console.log('bookRoom :', data)
            const response = await api.post("dat-phong", data)
            return response.data
        } catch (error: any) {
            console.error('bookRoom API error:', error)
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Lấy danh sách phòng nghỉ dưỡng thất bại"
            return rejectWithValue(errorMessage)
        }
    }
)

export const getBookRoomByUser = createAsyncThunk<any, number, { rejectValue: string }>(
    "lay-theo-nguoi-dung",
    async (maNguoiDung, { rejectWithValue }) => {
        try {
            const response = await api.get(`dat-phong/lay-theo-nguoi-dung/${maNguoiDung}`)
            return response.data
        } catch (error: any) {
            console.error('dat-phong lay-theo-nguoi-dung:', error)
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Lấy danh sách đặt phòng thất bại"
            return rejectWithValue(errorMessage)
        }
    }
)

const roomsSlice = createSlice({
    name: "rooms",
    initialState,
    reducers: {
        clearError: (state) => {
            state.message = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(bookRoom.pending, (state) => {
                state.loading = true
                state.message = null
            })
            .addCase(bookRoom.fulfilled, (state, action) => {
                console.log('Load Rooms fulfilled - Full response:', action.payload)
                state.loading = false
                state.bookRoom = action.payload.content
                state.message = action.payload.message
                state.success = true

            })
            .addCase(bookRoom.rejected, (state, action) => {
                console.log('Load Rooms rejected:', action.payload)
                state.loading = false
                state.success = false
                state.message = action.payload || "Lấy danh sách phòng nghỉ dướng thất bại"
            })
            .addCase(getBookRoomByUser.pending, (state) => {
                state.loading = true
                state.message = null
            })
            .addCase(getBookRoomByUser.fulfilled, (state, action) => {
                state.loading = false
                state.bookRooms = action.payload.content
                state.message = action.payload.message
                state.success = true

            })
            .addCase(getBookRoomByUser.rejected, (state, action) => {
                state.loading = false
                state.success = false
                state.message = action.payload || "Lấy danh sách phòng nghỉ dướng thất bại"
            })
    }
})
export const { clearError } = roomsSlice.actions
export default roomsSlice.reducer
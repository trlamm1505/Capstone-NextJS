import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../../services/api"
import type { RoomResponse, RoomFormData } from "../../types/Room"

interface RoomState {
    loading: boolean
    room: any | null
    message: string | null
    success: boolean | null
}

const initialState: RoomState = {
    loading: false,
    room: null,
    message: null,
    success: false
}

export const addRoom = createAsyncThunk<RoomResponse, RoomFormData, { rejectValue: string }>(
    "rooms/addRoom",
    async (credentials, { rejectWithValue }) => {
        try {
            console.log('addRoom API data:', credentials)
            const response = await api.post<RoomResponse>("phong-thue", credentials)
            return response.data
        } catch (error: any) {
            console.error('addRoom API error:', error)
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Thêm phòng thất bại"
            return rejectWithValue(errorMessage)
        }
    }
)

const roomSlice = createSlice({
    name: "rooms",
    initialState,
    reducers: {
        clearError: (state) => {
            state.loading = false
            state.success = false
            state.message = null
        },
        resetRoom: (state) => {
            state.room = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addRoom.pending, (state) => {
                state.loading = true
                state.message = null
                state.success = false
            })
            .addCase(addRoom.fulfilled, (state, action) => {
                state.loading = false
                state.room = action.payload.content
                state.message = action.payload.message 
                state.success = true
            })
            .addCase(addRoom.rejected, (state, action) => {
                state.loading = false
                state.success = false
                state.message = action.payload || "Thêm phòng thất bại"
            })
    }
})

export const { clearError, resetRoom } = roomSlice.actions
export default roomSlice.reducer

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../../services/api"
import { defaultPagination } from "../../types/Pagination"
import type { Pagination } from "../../types/Pagination"
import type { RoomPaginationResponse, RoomResponse } from "../../types/Room"

interface RoomPaginationState {
    loading: boolean
    rooms: any | null
    error: string | null
    success: boolean | null
    pagination: Pagination | null,
    locations: any | null
}

const initialState: RoomPaginationState = {
    loading: false,
    rooms: null,
    error: null,
    success: false,
    pagination: defaultPagination,
    locations: null
}

export const fetchAllRooms = createAsyncThunk<RoomResponse, void, { rejectValue: string }>(
    "phong-thue",
    async (_args, { rejectWithValue }) => {
        try {
            console.log('fetchAllRooms pagination:')
            const response = await api.get("phong-thue")
            return response.data
        } catch (error: any) {
            console.error('fetchAllRooms API error:', error)
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Lấy danh sách phòng nghỉ dưỡng thất bại"
            return rejectWithValue(errorMessage)
        }
    }
)

export const loadRoomsPagination = createAsyncThunk<RoomPaginationResponse, Pagination, { rejectValue: string }>(
    "phong-thue-phan-trang",
    async (credentials, { rejectWithValue }) => {
        try {
            console.log('loadRoomsPagination pagination:', credentials)

            const { pageIndex, pageSize, keyword } = credentials
            const response = await api.get("phong-thue/phan-trang-tim-kiem", { params: { pageIndex, pageSize, keyword } })
            return response.data
        } catch (error: any) {
            console.error('loadRoomsPagination API error:', error)
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Lấy danh sách phòng nghỉ dưỡng thất bại"
            return rejectWithValue(errorMessage)
        }
    }
)


export const deleteRoom = createAsyncThunk<RoomResponse, string, { rejectValue: any }>(
    "deleteRoom",
    async (id, { rejectWithValue }) => {
        try {
            console.log('deleteRoom - deleteRoom id=' + id)
            const response = await api.delete(`phong-thue/${id}`)
            return response.data
        } catch (error: any) {
            console.error('deleteRoom - API error:', error)
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Lỗi khi tải danh sách phim"
            return rejectWithValue(errorMessage)
        }
    }
)

export const loadRoomsByUser = createAsyncThunk<RoomPaginationResponse, Pagination, { rejectValue: string }>(
    "phong-thue-phan-trang",
    async (credentials, { rejectWithValue }) => {
        try {
            console.log('loadRoomsPagination pagination:', credentials)

            const { pageIndex, pageSize, keyword } = credentials
            const response = await api.get("phong-thue/phan-trang-tim-kiem", { params: { pageIndex, pageSize, keyword } })
            return response.data
        } catch (error: any) {
            console.error('loadRoomsPagination API error:', error)
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Lấy danh sách phòng nghỉ dưỡng thất bại"
            return rejectWithValue(errorMessage)
        }
    }
)

const roomsSlice = createSlice({
    name: "rooms",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        setPagination: (state, action) => {
            const { pageIndex, keyword } = action.payload
            console.log("setPagination:: ", state.pagination?.pageIndex)
            if (state.pagination) {
                state.pagination.pageIndex = pageIndex
                state.pagination.keyword = keyword

                console.log("setPagination 11:: ", state.pagination?.pageIndex, "key: " + keyword)
            }

            console.log("setPagination 22:: ", state.pagination?.pageIndex, "key: " + keyword)
        }
    },
    extraReducers: (builder) => {
        // Login cases
        builder
            .addCase(loadRoomsPagination.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loadRoomsPagination.fulfilled, (state, action) => {
                console.log('Load Rooms fulfilled - Full response:', action.payload)
                state.loading = false
                state.rooms = action.payload.content.data
                state.success = true
                if (state.pagination) {
                    state.pagination.totalPages = Math.ceil(action.payload.content.totalRow / state.pagination.pageSize)
                    state.pagination.totalRow = action.payload.content.totalRow
                }

            })
            .addCase(loadRoomsPagination.rejected, (state, action) => {
                console.log('Load Rooms rejected:', action.payload)
                state.loading = false
                state.success = false
                state.error = action.payload || "Lấy danh sách phòng nghỉ dướng thất bại"
            })

            .addCase(fetchAllRooms.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAllRooms.fulfilled, (state, action) => {
                console.log('fetchAllRooms - Full response:', action.payload)
                state.loading = false
                state.rooms = action.payload.content
                state.success = true
            })
            .addCase(fetchAllRooms.rejected, (state, action) => {
                console.log('fetchAllRooms rejected:', action.payload)
                state.loading = false
                state.success = false
                state.error = action.payload || "Lấy danh sách phòng nghỉ dướng thất bại"
            })

            .addCase(deleteRoom.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteRoom.fulfilled, (state, action) => {
                console.log('deleteRoom Rooms fulfilled - Full response:', action.payload)
                state.loading = false
                state.success = true
                state.error = "Xóa thành công"
            })
            .addCase(deleteRoom.rejected, (state, action) => {
                console.log('deleteRoom rejected:', action.payload)
                state.loading = false
                state.success = false
                state.error = action.payload?.message || "Xóa phòng nghỉ thất bại"
            })
    }
})

export const { clearError, setPagination } = roomsSlice.actions
export default roomsSlice.reducer
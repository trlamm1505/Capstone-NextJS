import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from "../../../../services/api"
import type { User, UsersAPIResponse, UserType, UserForm } from "../../types/Users"
import { UserTypeValue } from "../../types/Users"
import { defaultPagination, type Pagination } from '../../types/Pagination'

interface UserState {
  user: any | null
  users: any | null
  usersFilter: any | null
  userTypes: UserType[]
  status: string | null
  loading: boolean
  error: string | null
  success: boolean
  userPagination: Pagination
}

export interface UsersPaginatedResponse {
  statusCode: number
  content: Pagination & {
    data: User[]
  }
  dateTime: string
}

const initialState: UserState = {
  user: null,
  users: null,
  usersFilter: null,
  userTypes: UserTypeValue,
  status: null,
  loading: false,
  error: null,
  success: false,
  userPagination: defaultPagination,
}

const handleError = (error: any): string => {
  console.log(error, 'error')
  if (error.response?.data?.content) return error.response.data.content
  if (error.response?.data?.message) return error.response.data.message
  if (typeof error.response?.data === 'string') return error.response.data
  if (typeof error.response?.message === 'string') return error.response.message
  if (typeof error.response?.content === 'string') return error.response.content
  if (error.message) return error.message
  return 'Lỗi hệ thống'
}

// ==============================
// Async Thunks
// ==============================

export const fetchUsersByPagination = createAsyncThunk<UsersPaginatedResponse, Pagination>(
  'users/fetchUsers',
  async (credentials, { rejectWithValue }) => {
    try {
      const { pageIndex, pageSize, keyword } = credentials
      const params = { pageIndex, pageSize, keyword }
      const response = await api.get(`users/phan-trang-tim-kiem`, { params: params })
      return response.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

export const fetchAllUsers = createAsyncThunk<UsersAPIResponse<any>>(
  'users/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`users`)
      return response.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

export const addUser = createAsyncThunk<UsersAPIResponse<User>, UserForm, { rejectValue: string }>(
  'users/addUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post(`users`, userData, {
        headers: { 'Content-Type': 'application/json' },
      })
      return res.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

export const fetchUserById = createAsyncThunk<UsersAPIResponse<User>, string, { rejectValue: string }>(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {

      const res = await api.get(`users/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      return res.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

export const editUser = createAsyncThunk<UsersAPIResponse<any>, User, { rejectValue: string }>(
  'users/editUser',
  async (userData, { rejectWithValue }) => {
    try {
      const { id } = userData
      const res = await api.put(`users/${id}`, userData, {
        headers: { 'Content-Type': 'application/json' },
      })
      return res.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

export const delUsers = createAsyncThunk<UsersAPIResponse<any>, number>(
  'users/delUsers',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`users/?id=${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

export const convertToISODate = (date:string) => {
return date
  // const [day, month, year] = date.split("/")
  // return `${year}-${ String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

// ==============================
// Initial State
// ==============================

// ==============================
// Slice
// ==============================

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetState: (state) => {
      state.error = null
      state.success = false
      state.loading = false
    },

    setUserPagination: (state, action) => {
      const { pageIndex, keyword } = action.payload
      if (state.userPagination) {
        state.userPagination.pageIndex = pageIndex
        state.userPagination.keyword = keyword
      }
    },
    fetchAllUsersFilter: (state, action) => {
      const { keyword } = action.payload
      const data = state.users || []
      state.usersFilter = data.filter((s: any) => {
        return s.name.toLowerCase().includes(keyword)
      })
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== Search Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.error = null
        state.loading = true
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload.content
        state.usersFilter = action.payload.content
        state.status = 'succeeded'
        state.loading = false
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.error = action.payload as string
        state.success = false
        state.loading = false
      })

      //===== Search Users By Page
      .addCase(fetchUsersByPagination.pending, (state) => {
        state.error = null
        state.loading = true
      })
      .addCase(fetchUsersByPagination.fulfilled, (state, action) => {
        state.users = action.payload.content.data
        state.usersFilter = action.payload.content.data
        state.status = 'succeeded'
        state.loading = false
        if (state.userPagination) {
          state.userPagination.totalPages = Math.ceil(action.payload.content.totalRow / state.userPagination.pageSize)
          state.userPagination.totalRow = action.payload.content.totalRow
          console.log({ ...state.userPagination }, 'state.userPagination')
          console.log(state.usersFilter, 'usersFilter')
          console.log(action.payload.content.data, 'action.payload.content.data')
        }
      })
      .addCase(fetchUsersByPagination.rejected, (state, action) => {
        state.error = action.payload as string
        state.success = false
        state.loading = false
      })

      // ===== Add User
      .addCase(addUser.pending, (state) => {
        state.error = null
        state.loading = true
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.user = action.payload.content
        state.error = 'Thêm user thành công'
        state.success = true
        state.loading = false
      })
      .addCase(addUser.rejected, (state, action) => {
        state.error = action.payload as string || "Có lỗi xảy ra"
        state.success = false
        state.loading = false
      })

      // ===== Find User
      .addCase(fetchUserById.pending, (state) => {
        state.error = null
        state.success = false
        state.loading = true
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.user = action.payload.content
        state.success = true
        state.loading = false
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.error = action.payload as string || "Có lỗi xảy ra"
        state.success = false
        state.loading = false
      })

      // ===== Edit User
      .addCase(editUser.pending, (state) => {
        state.error = null
        state.success = false
        state.loading = true
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.user = action.payload.content
        state.error = "Chỉnh sửa user thành công"
        state.success = true
        state.loading = false
      })
      .addCase(editUser.rejected, (state, action) => {
        state.error = action.payload as string || "Có lỗi xảy ra"
        state.success = false
        state.loading = false
      })

      // ===== Delete User
      .addCase(delUsers.pending, (state) => {
        state.error = null
        state.success = false
        state.loading = true
      })
      .addCase(delUsers.fulfilled, (state, action) => {
        state.user = null
        state.error = action.payload.message || 'Xóa user thành công'
        state.success = true
        state.loading = false
      })
      .addCase(delUsers.rejected, (state, action) => {
        state.error = action.payload as string || "Có lỗi xảy ra"
        state.success = false
        state.loading = false
      })
  },
})

export const { resetState, setUserPagination } = userSlice.actions
export default userSlice.reducer

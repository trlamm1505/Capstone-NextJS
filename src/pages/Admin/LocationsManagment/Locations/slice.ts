import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Location, LocationForm, LocationsAPIResponse, LocationsPaginatedResponse } from '../../types/Locations'
import { defaultPagination, type Pagination } from "../../types/Pagination"
import api from '../../admin-services/api'

interface LocationState {
  location: any | null
  locations: any | null
  locationsFilter: any | null
  status: string | null
  loading: boolean
  error: string | null
  success: boolean
  locationPagination: Pagination
}

export interface LocationPaginatedResponse {
  statusCode: number
  content: Pagination & {
    data: Location[]
  }
  dateTime: string
}

const initialState: LocationState = {
  location: null,
  locations: null,
  locationsFilter: null,
  status: null,
  loading: false,
  error: null,
  success: false,
  locationPagination: defaultPagination,
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

export const fetchLocationsByPagination = createAsyncThunk<LocationsPaginatedResponse, Pagination>(
  'locations/fetchlocations',
  async (credentials, { rejectWithValue }) => {
    try {
      const { pageIndex, pageSize, keyword } = credentials
      const params = { pageIndex, pageSize, keyword }
      const response = await api.get(`vi-tri/phan-trang-tim-kiem`, { params: params })
      return response.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

export const fetchAllLocations = createAsyncThunk<LocationsAPIResponse<any>>(
  'locations/fetchAllLocations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`vi-tri`)
      return response.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

export const addLocation = createAsyncThunk<LocationsAPIResponse<Location>, LocationForm, { rejectValue: string }>(
  'location/addLocation',
  async (locationData, { rejectWithValue }) => {
    try {
      const res = await api.post(`vi-tri`, locationData, {
        headers: { 'Content-Type': 'application/json' },
      })
      return res.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

export const fetchLocationById = createAsyncThunk<LocationsAPIResponse<Location>, number, { rejectValue: string }>(
  'Locations/fetchLocationById',
  async (id, { rejectWithValue }) => {
    try {

      const res = await api.get(`vi-tri/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      return res.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

export const editLocation = createAsyncThunk<LocationsAPIResponse<any>, Location, { rejectValue: string }>(
  'locations/editLocation',
  async (locationData, { rejectWithValue }) => {
    try {
      const { id } = locationData
      const res = await api.put(`vi-tri/${id}`, locationData, {
        headers: { 'Content-Type': 'application/json' },
      })
      return res.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

export const delLocations = createAsyncThunk<LocationsAPIResponse<any>, number>(
  'locations/delLocations',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`vi-tri/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

const locationSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    resetState: (state) => {
      state.error = ''
      state.success = false
      state.loading = false
    },

    setLocationPagination: (state, action) => {
      const { pageIndex, keyword } = action.payload
      if (state.locationPagination) {
        state.locationPagination.pageIndex = pageIndex
        state.locationPagination.keyword = keyword
      }
    },
    fetchAllLocationsFilter: (state, action) => {
      const { keyword } = action.payload
      const data = state.locations || []
      state.locationsFilter = data.filter((s: any) => {
        return s.name.toLowerCase().includes(keyword)
      })
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== Search Locations
      .addCase(fetchAllLocations.pending, (state) => {
        state.error = ''
        state.loading = true
      })
      .addCase(fetchAllLocations.fulfilled, (state, action) => {
        state.locations = action.payload.content
        state.locationsFilter = action.payload.content
        state.status = 'succeeded'
        state.loading = false
      })
      .addCase(fetchAllLocations.rejected, (state, action) => {
        state.error = action.payload as string
        state.success = false
        state.loading = false
      })

      //===== Search Locations By Page
      .addCase(fetchLocationsByPagination.pending, (state) => {
        state.error = ''
        state.loading = true
      })
      .addCase(fetchLocationsByPagination.fulfilled, (state, action) => {
        state.location = action.payload.content.data
        state.locationsFilter = action.payload.content.data
        state.status = 'succeeded'
        state.loading = false
        if (state.locationPagination) {
          state.locationPagination.totalPages = Math.ceil(action.payload.content.totalRow / state.locationPagination.pageSize)
          state.locationPagination.totalRow = action.payload.content.totalRow
          console.log({ ...state.locationPagination }, 'state.locationPagination')
          console.log(state.locationsFilter, 'LocationsFilter')
          console.log(action.payload.content.data, 'action.payload.content.data')
        }
      })
      .addCase(fetchLocationsByPagination.rejected, (state, action) => {
        state.error = action.payload as string
        state.success = false
        state.loading = false
      })

      // ===== Add Location
      .addCase(addLocation.pending, (state) => {
        state.error = ''
        state.loading = true
      })
      .addCase(addLocation.fulfilled, (state, action) => {
        state.location = action.payload.content
        state.error = 'Thêm Vị trí thành công'
        state.success = true
        state.loading = false
      })
      .addCase(addLocation.rejected, (state, action) => {
        state.error = action.payload as string || "Có lỗi xảy ra"
        state.success = false
        state.loading = false
      })

      // ===== Find Location
      .addCase(fetchLocationById.pending, (state) => {
        state.error = ''
        state.success = false
        state.loading = true
      })
      .addCase(fetchLocationById.fulfilled, (state, action) => {
        state.location = action.payload.content
        state.success = true
        state.loading = false
      })
      .addCase(fetchLocationById.rejected, (state, action) => {
        state.error = action.payload as string || "Có lỗi xảy ra"
        state.success = false
        state.loading = false
      })

      // ===== Edit Location
      .addCase(editLocation.pending, (state) => {
        state.error = ''
        state.success = false
        state.loading = true
      })
      .addCase(editLocation.fulfilled, (state, action) => {
        state.location = action.payload.content
        state.error = "Chỉnh sửa Vị trí thành công"
        state.success = true
        state.loading = false
      })
      .addCase(editLocation.rejected, (state, action) => {
        state.error = action.payload as string || "Có lỗi xảy ra"
        state.success = false
        state.loading = false
      })

      // ===== Delete Location
      .addCase(delLocations.pending, (state) => {
        state.error = ''
        state.success = false
        state.loading = true
      })
      .addCase(delLocations.fulfilled, (state, action) => {
        state.location = null
        state.error = action.payload.message || ''
        state.success = true
        state.loading = false
      })
      .addCase(delLocations.rejected, (state, action) => {
        state.error = action.payload as string || "Có lỗi xảy ra"
        state.success = false
        state.loading = false
      })
  },
})

export const { resetState, setLocationPagination } = locationSlice.actions
export default locationSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

// Types for location data
export interface Location {
    id: number;
    tenViTri: string;
    tinhThanh: string;
    quocGia: string;
    hinhAnh: string;
}

export interface LocationResponse {
    statusCode: number;
    content: Location[];
}

// Paginated search response
export interface LocationSearchResponse {
    statusCode: number;
    content: {
        pageIndex: number;
        pageSize: number;
        totalRow: number;
        keywords: string | null;
        data: Location[];
    };
}

export interface LocationState {
    locations: Location[];
    loading: boolean;
    error: string | null;
    searchQuery: string;
    suggestions: Location[];
    showSuggestions: boolean;
    featured: Location[];
}

const initialState: LocationState = {
    locations: [],
    loading: false,
    error: null,
    searchQuery: "",
    suggestions: [],
    showSuggestions: false,
    featured: [],
};

const normalizeText = (text: string) =>
    text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d");

// Async thunk to fetch all locations
export const fetchLocations = createAsyncThunk(
    "location/fetchLocations",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<LocationResponse>("/vi-tri");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch locations");
        }
    }
);

// Fetch featured/nearby locations (first page, no keyword)
export const fetchFeaturedLocations = createAsyncThunk(
    "location/fetchFeatured",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<LocationSearchResponse>("/vi-tri/phan-trang-tim-kiem", {
                params: { pageIndex: 1, pageSize: 8, keyword: "" },
            });
            return response.data?.content?.data || [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch featured locations");
        }
    }
);

// Async thunk to search locations by query using paginated API
export const searchLocations = createAsyncThunk(
    "location/searchLocations",
    async (query: string, { getState, rejectWithValue }) => {
        try {
            const keyword = query.trim();
            if (keyword.length === 0) {
                return [] as Location[];
            }

            // First try server-side paginated search
            let locations: Location[] = [];
            try {
                const resp = await api.get<LocationSearchResponse>("/vi-tri/phan-trang-tim-kiem", {
                    params: { pageIndex: 1, pageSize: 10, keyword },
                });
                locations = resp.data?.content?.data || [];
            } catch (_) {
                // ignore, will fallback
            }

            // If server search gives nothing, fallback to full list
            if (!locations || locations.length === 0) {
                const allResp = await api.get<LocationResponse>("/vi-tri");
                locations = allResp.data?.content || [];
            }

            const normQuery = normalizeText(keyword);
            const filtered = locations.filter((loc) => {
                const ten = normalizeText(loc.tenViTri);
                const tinh = normalizeText(loc.tinhThanh);
                const quocGia = normalizeText(loc.quocGia);
                return ten.includes(normQuery) || tinh.includes(normQuery) || quocGia.includes(normQuery);
            });

            return filtered;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to search locations");
        }
    }
);

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
            if (action.payload.length === 0) {
                state.suggestions = [];
                state.showSuggestions = false;
            }
        },
        setShowSuggestions: (state, action) => {
            state.showSuggestions = action.payload;
        },
        clearSuggestions: (state) => {
            state.suggestions = [];
            state.showSuggestions = false;
        },
        selectLocation: (state, action) => {
            state.searchQuery = action.payload.tenViTri;
            state.suggestions = [];
            state.showSuggestions = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all locations
            .addCase(fetchLocations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLocations.fulfilled, (state, action) => {
                state.loading = false;
                state.locations = (action.payload as LocationResponse)?.content || [];
                state.error = null;
            })
            .addCase(fetchLocations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Featured
            .addCase(fetchFeaturedLocations.fulfilled, (state, action) => {
                state.featured = action.payload as Location[];
            })
            // Search locations
            .addCase(searchLocations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchLocations.fulfilled, (state, action) => {
                state.loading = false;
                state.suggestions = action.payload as Location[];
                state.showSuggestions = (action.payload as Location[]).length > 0;
                state.error = null;
            })
            .addCase(searchLocations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.suggestions = [];
                state.showSuggestions = false;
            });
    },
});

export const { setSearchQuery, setShowSuggestions, clearSuggestions, selectLocation, clearError } = locationSlice.actions;

export default locationSlice.reducer;

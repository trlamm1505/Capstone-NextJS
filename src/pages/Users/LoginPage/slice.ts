import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import api from "../../../services/api";

// Types
export type LoginCredentials = {
    email: string;
    password: string;
};

export type AuthUser = any;

type LoginState = {
    loading: boolean;
    user: AuthUser | null;
    error: string | null;
    isAuthenticated: boolean;
};

const initialState: LoginState = {
    loading: false,
    user: null,
    error: null,
    isAuthenticated: false,
};

export const loginUser = createAsyncThunk<
    any,
    LoginCredentials,
    { rejectValue: string }
>(
    "login/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/signin", credentials);
            return res.data;
        } catch (err) {
            const error = err as AxiosError<any>;
            const data = error.response?.data as any;
            const message = data?.content || data?.message || (typeof data === "string" ? data : undefined) || error.message || "Đăng nhập thất bại";
            return rejectWithValue(message);
        }
    }
);

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            try {
                localStorage.removeItem('auth_user');
                localStorage.removeItem('auth_isAuthenticated');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('lastActivity');
                // Clear any other auth-related data
                localStorage.removeItem('pendingBooking');
            } catch (error) {
                console.error('Error clearing auth data:', error);
            }
        },
        setAuthenticated: (state, action: PayloadAction<AuthUser | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                // API format: prefer content.user then content, else root
                const payload = action.payload as any;
                const user = payload?.content?.user ?? payload?.content ?? payload?.user ?? null;
                // Persist access token from API if available (for authenticated endpoints like /binh-luan)
                const token = payload?.content?.token || payload?.token || user?.token || user?.accessToken;
                if (user && token) {
                    (user as any).token = token;
                }
                state.user = user;
                state.isAuthenticated = !!user;
                state.error = null;
                // Persist to localStorage for reload resilience
                try {
                    if (user) {
                        localStorage.setItem('auth_user', JSON.stringify(user));
                        localStorage.setItem('auth_isAuthenticated', 'true');
                        if (token) localStorage.setItem('accessToken', token);
                        // Set initial activity time for session management
                        localStorage.setItem('lastActivity', Date.now().toString());
                    } else {
                        localStorage.removeItem('auth_user');
                        localStorage.removeItem('auth_isAuthenticated');
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('lastActivity');
                    }
                } catch (error) {
                    console.error('Error saving auth data to localStorage:', error);
                }
            })
            .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload ?? "Đăng nhập thất bại";
                state.isAuthenticated = false;
            });
    },
});

export const { clearError, logout, setAuthenticated } = loginSlice.actions;
export default loginSlice.reducer; 
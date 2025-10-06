import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import sessionManager from "../../../utils/session";
import api from "../../../services/api";

interface AuthState {
    loading: boolean;
    user: any | null;
    error: string | null;
    registerLoading: boolean;
    registerError: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    loading: false,
    user: null,
    error: null,
    registerLoading: false,
    registerError: null,
    isAuthenticated: false,
};

// === Thunks ===

export const loginUser = createAsyncThunk(
    "login/loginUser",
    async (credentials: any, { rejectWithValue }) => {
        try {
            const response = await api.post("auth/signin", credentials);
            return response.data;
        } catch (error: any) {
            console.error("Login API error:", error);
            const errorMessage =
                error.response?.data?.content ||
                error.response?.data ||
                error.message ||
                "Đăng nhập thất bại";
            return rejectWithValue(errorMessage);
        }
    }
);

export const checkAuthStatus = createAsyncThunk(
    "login/checkAuthStatus",
    async (_, { rejectWithValue }) => {
        try {
            console.log("Checking auth status...");

            const storedUser = localStorage.getItem("auth_user");
            const storedAuth = localStorage.getItem("auth_isAuthenticated");

            if (storedUser && storedAuth && JSON.parse(storedAuth)) {
                if (sessionManager.isSessionValid()) {
                    const userData = JSON.parse(storedUser);
                    return { content: { user: userData } };
                } else {
                    sessionManager.stopSession();
                    clearAuthFromStorage();
                    return rejectWithValue("Session expired");
                }
            }

            return rejectWithValue("No auth data");
        } catch (error) {
            console.error("Auth check failed:", error);
            return rejectWithValue("Auth check failed");
        }
    }
);

// === Slice ===

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearRegisterError: (state) => {
            state.registerError = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            clearAuthFromStorage();
            sessionManager.stopSession();
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;

                clearAuthFromStorage();

                const { user, token } = action.payload.content;

                state.user = user;
                state.isAuthenticated = true;
                state.error = null;

                saveAuthToStorage(user, true, token);

                if (token) {
                    localStorage.setItem("accessToken", token);
                }

                sessionManager.initSession();
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Đăng nhập thất bại";
                state.isAuthenticated = false;
                clearAuthFromStorage();
            })

            // Check Auth
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.user = action.payload?.content?.user || null;
                state.isAuthenticated = !!state.user;
                state.error = null;
            })
            .addCase(checkAuthStatus.rejected, (state, action) => {
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload as string || null;
            });
    },
});

// === Helpers ===

const clearAuthFromStorage = () => {
    try {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_isAuthenticated");
        localStorage.removeItem("accessToken");
    } catch (error) {
        console.error("Error clearing auth from localStorage:", error);
    }
};

const saveAuthToStorage = (
    user: any,
    isAuthenticated: boolean,
    accessToken?: string
) => {
    try {
        localStorage.setItem("auth_user", JSON.stringify(user));
        localStorage.setItem("auth_isAuthenticated", JSON.stringify(isAuthenticated));
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
        }
    } catch (error) {
        console.error("Error saving auth to localStorage:", error);
    }
};

// === Exports ===

export const { clearError, clearRegisterError, logout } = loginSlice.actions;
export default loginSlice.reducer;
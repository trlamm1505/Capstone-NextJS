import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import api from "../../../services/api";

// Types
type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    birthday?: string;
    gender?: boolean;
    role?: string;
};

type RegisterState = {
    loading: boolean;
    error: string | null;
    success: boolean;
    emailChecking: boolean;
    emailTaken: boolean;
};

const initialState: RegisterState = {
    loading: false,
    error: null,
    success: false,
    emailChecking: false,
    emailTaken: false,
};

export const checkEmailExists = createAsyncThunk<
    boolean,
    string,
    { rejectValue: string }
>(
    "register/checkEmailExists",
    async (email, { rejectWithValue }) => {
        try {
            const usersRes = await api.get("/users");
            const users: any[] = usersRes?.data?.content ?? usersRes?.data ?? [];
            const exists = Array.isArray(users) && users.some((u: any) => (u?.email || "").toLowerCase() === email.toLowerCase());
            return exists;
        } catch (err) {
            const error = err as AxiosError<any>;
            const data = error.response?.data as any;
            const message = data?.message || (typeof data === "string" ? data : undefined) || error.message || "Kiểm tra email thất bại";
            return rejectWithValue(message);
        }
    }
);

export const registerUser = createAsyncThunk<
    any,
    RegisterPayload,
    { rejectValue: string }
>(
    "register/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            // 1) Pre-check: fetch users and ensure email is not taken
            const usersRes = await api.get("/users");
            const users: any[] = usersRes?.data?.content ?? usersRes?.data ?? [];
            const emailExists = Array.isArray(users) && users.some((u: any) => (u?.email || "").toLowerCase() === userData.email.toLowerCase());
            if (emailExists) {
                return rejectWithValue("Email đã tồn tại");
            }

            // 2) Proceed to signup
            const response = await api.post("/auth/signup", userData);
            return response.data;
        } catch (err) {
            const error = err as AxiosError<any>;
            console.error('Register error:', error);

            // Xử lý các loại lỗi khác nhau
            if (!error.response) {
                return rejectWithValue("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
            }

            let errorMessage = "Đăng ký thất bại";
            const data = error.response?.data as any;

            if (data?.content) {
                errorMessage = data.content;
            } else if (data?.message) {
                errorMessage = data.message;
            } else if (typeof data === "string") {
                errorMessage = data;
            } else if (error.response.status === 400) {
                errorMessage = "Thông tin không hợp lệ. Vui lòng kiểm tra lại.";
            } else if (error.response.status === 409) {
                errorMessage = "Email đã tồn tại trong hệ thống";
            } else if (error.response.status >= 500) {
                errorMessage = "Lỗi server. Vui lòng thử lại sau.";
            }

            return rejectWithValue(errorMessage);
        }
    }
);

const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        resetEmailCheck: (state) => {
            state.emailChecking = false;
            state.emailTaken = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkEmailExists.pending, (state) => {
                state.emailChecking = true;
            })
            .addCase(checkEmailExists.fulfilled, (state, action: PayloadAction<boolean>) => {
                state.emailChecking = false;
                state.emailTaken = action.payload;
            })
            .addCase(checkEmailExists.rejected, (state) => {
                state.emailChecking = false;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload ?? "Đăng ký thất bại";
                state.success = false;
            });
    },
});

export const { clearError, clearSuccess, resetEmailCheck } = registerSlice.actions;
export default registerSlice.reducer; 
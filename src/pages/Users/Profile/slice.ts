import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../../services/api";
import type { RootState } from "../../store";

export type Profile = {
    id: number;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    birthday?: string;
    avatar?: string;
    gender?: boolean;
    createdAt?: string;
};

type ProfileState = {
    loading: boolean;
    error: string | null;
    profile: Profile | null;
};

const initialState: ProfileState = {
    loading: false,
    error: null,
    profile: null,
};

export const fetchProfile = createAsyncThunk<
    Profile,
    void,
    { rejectValue: string; state: RootState }
>(
    "profile/fetch",
    async (_, { rejectWithValue, getState }) => {
        try {
            // Always call list API and select by id to mirror source of truth
            const loginUser = (getState() as any)?.login?.user;
            let id: number | undefined = loginUser?.id ?? loginUser?.userId ?? loginUser?.maNguoiDung;
            if (!id) {
                try {
                    const stored = localStorage.getItem("auth_user");
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        id = parsed?.id ?? parsed?.userId ?? parsed?.maNguoiDung;
                    }
                } catch { /* ignore */ }
            }

            // If still no id, treat as unauthenticated
            if (!id) {
                return rejectWithValue("Chưa đăng nhập");
            }

            const res = await api.get("/users");
            const list = (res?.data?.content ?? res?.data ?? []) as any[];
            const me = list.find((u) => Number(u?.id) === Number(id)) || {};

            return {
                id: Number(me?.id ?? id ?? 0),
                name: me?.name ?? me?.hoTen ?? "",
                email: me?.email ?? loginUser?.email ?? "",
                password: me?.password,
                phone: me?.phone ?? me?.soDT,
                birthday: me?.birthday,
                avatar: me?.avatar ?? me?.avatarUrl,
                gender: me?.gender,
                createdAt: me?.createdAt,
            };
        } catch (e: any) {
            console.error('Fetch profile error:', e);

            // Xử lý các loại lỗi khác nhau
            if (!e.response) {
                return rejectWithValue("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
            }

            const data = e.response?.data as any;
            let message = "Không tải được hồ sơ";

            if (data?.content) {
                message = data.content;
            } else if (data?.message) {
                message = data.message;
            } else if (typeof data === "string") {
                message = data;
            } else if (e.response.status === 401) {
                message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
            } else if (e.response.status === 403) {
                message = "Không có quyền truy cập thông tin này.";
            } else if (e.response.status >= 500) {
                message = "Lỗi server. Vui lòng thử lại sau.";
            }

            return rejectWithValue(message);
        }
    }
);

export const updateProfile = createAsyncThunk<
    Profile,
    Partial<Profile> & { id: number },
    { rejectValue: string }
>(
    "profile/update",
    async (payload, { rejectWithValue }) => {
        try {
            const { id, ...data } = payload;
            const res = await api.put(`/users/${id}`, data);
            const content = (res?.data?.content ?? res?.data) as any;
            return {
                id: content?.id ?? id,
                name: content?.name ?? content?.hoTen ?? "",
                email: content?.email ?? "",
                password: content?.password,
                phone: content?.phone ?? content?.soDT,
                birthday: content?.birthday,
                avatar: content?.avatar ?? content?.avatarUrl,
                gender: content?.gender,
                createdAt: content?.createdAt,
            };
        } catch (e: any) {
            console.error('Update profile error:', e);

            // Xử lý các loại lỗi khác nhau
            if (!e.response) {
                return rejectWithValue("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
            }

            const data = e.response?.data as any;
            let message = "Cập nhật hồ sơ thất bại";

            if (data?.content) {
                message = data.content;
            } else if (data?.message) {
                message = data.message;
            } else if (typeof data === "string") {
                message = data;
            } else if (e.response.status === 400) {
                message = "Thông tin không hợp lệ. Vui lòng kiểm tra lại.";
            } else if (e.response.status === 401) {
                message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
            } else if (e.response.status === 403) {
                message = "Không có quyền cập nhật thông tin này.";
            } else if (e.response.status === 409) {
                message = "Email đã được sử dụng bởi tài khoản khác.";
            } else if (e.response.status >= 500) {
                message = "Lỗi server. Vui lòng thử lại sau.";
            }

            return rejectWithValue(message);
        }
    }
);

const slice = createSlice({
    name: "profile",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload ?? "Không tải được hồ sơ";
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload ?? "Cập nhật hồ sơ thất bại";
            });
    },
});

export default slice.reducer;


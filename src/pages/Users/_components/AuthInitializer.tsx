import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../LoginPage/slice";
import sessionManager from "../../../utils/session";
import type { AppDispatch } from "../store";

type Props = {
    children: React.ReactNode;
};

export default function AuthInitializer({ children }: Props) {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        // Initialize session manager early so we can validate before rehydrating
        try {
            sessionManager.setStore(window.__REDUX_STORE__ as any);
            sessionManager.initSession();
        } catch { }

        // Rehydrate auth from localStorage only if session still valid
        try {
            if (sessionManager.isSessionValid()) {
                const isAuth = localStorage.getItem('auth_isAuthenticated') === 'true';
                const userRaw = localStorage.getItem('auth_user');
                const token = localStorage.getItem('accessToken');
                let user: any = null;
                if (userRaw) {
                    user = JSON.parse(userRaw);
                    if (token && !user.token) user.token = token;
                }
                if (isAuth && user) {
                    dispatch(setAuthenticated(user));
                }
            } else {
                // If session invalid, clear persisted auth to enforce logout
                localStorage.removeItem('auth_user');
                localStorage.removeItem('auth_isAuthenticated');
                localStorage.removeItem('accessToken');
            }
        } catch { }
    }, [dispatch]);

    return <>{children}</>;
}







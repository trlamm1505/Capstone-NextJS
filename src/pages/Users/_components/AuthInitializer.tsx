import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../LoginPage/slice";
import sessionManager from "../../../utils/session";
import type { AppDispatch } from "../../store";

type Props = {
    children: React.ReactNode;
};

export default function AuthInitializer({ children }: Props) {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        // Initialize session manager early so we can validate before rehydrating
        try {
            sessionManager.setStore(window.__REDUX_STORE__ as any);
        } catch { }

        // Rehydrate auth from localStorage
        try {
            const isAuth = localStorage.getItem('auth_isAuthenticated') === 'true';
            const userRaw = localStorage.getItem('auth_user');
            const token = localStorage.getItem('accessToken');

            if (isAuth && userRaw) {
                let user: any = null;
                try {
                    user = JSON.parse(userRaw);
                    if (token && !user.token) user.token = token;
                } catch (parseError) {
                    console.error('Error parsing user data:', parseError);
                    // Clear corrupted data
                    localStorage.removeItem('auth_user');
                    localStorage.removeItem('auth_isAuthenticated');
                    localStorage.removeItem('accessToken');
                    return;
                }

                // Set user in Redux store
                dispatch(setAuthenticated(user));

                // Initialize session after setting user
                sessionManager.initSession();
            } else {
                // No auth data, clear any remnants
                localStorage.removeItem('auth_user');
                localStorage.removeItem('auth_isAuthenticated');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('lastActivity');
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
            // Clear all auth data on error
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_isAuthenticated');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('lastActivity');
        }
    }, [dispatch]);

    return <>{children}</>;
}







import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "../HomePage/slice";
import registerReducer from "../RegisterPage/slice";
import loginReducer from "../LoginPage/slice";
import listingsReducer from "../Listings/slice";
import roomDetailReducer from "../RoomDetail/slice";
import profileReducer from "../Profile/slice";

export const store = configureStore({
    reducer: {
        location: locationReducer,
        register: registerReducer,
        login: loginReducer,
        listings: listingsReducer,
        roomDetail: roomDetailReducer,
        profile: profileReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// TypeScript: augment Window to include __REDUX_STORE__
declare global {
    interface Window {
        __REDUX_STORE__?: typeof store;
    }
}

// Make store available globally for sessionManager
if (typeof window !== 'undefined') {
    window.__REDUX_STORE__ = store;
}

// Useful typed exports for Redux usage across the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

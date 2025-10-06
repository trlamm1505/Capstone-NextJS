import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "../Users/HomePage/slice";
import registerReducer from "../Users/RegisterPage/slice";
import loginReducer from "../Users/LoginPage/slice";
import listingsReducer from "../Users/Listings/slice";
import roomDetailReducer from "../Users/RoomDetail/slice";
import profileReducer from "../Users/Profile/slice";

import loginAdmReducer from "../Admin/LoginPage/slice";
import admRoomsReducer from "../Admin/RoomsManagement/Rooms/slice";
import admRoomReducer from "../Admin/RoomsManagement/AddRoom/slice";
import admEditRoomReducer from "../Admin/RoomsManagement/EditRoom/slice";
import admDetailRoomReducer from "../Admin/RoomsManagement/EditRoom/slice";
import usersAdminReducer from "../Admin/UsersManagement/Users/slice";
import admBookRoom from "../Admin/RoomsManagement/BookRoom/slice";
import admLocations from "../Admin/LocationsManagment/Locations/slice";

export const store = configureStore({
    reducer: {
        location: locationReducer,
        register: registerReducer,
        login: loginReducer,
        listings: listingsReducer,
        roomDetail: roomDetailReducer,
        profile: profileReducer,

        loginAdm: loginAdmReducer,
        admRooms: admRoomsReducer,
        admRoom: admRoomReducer,
        admEditRoom: admEditRoomReducer,
        admDetailRoom: admDetailRoomReducer,
        admUsers: usersAdminReducer,
        admBookRoom: admBookRoom,
        admLocations: admLocations
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

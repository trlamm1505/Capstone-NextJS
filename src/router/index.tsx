import React from "react";
import { Route } from "react-router-dom";
import HomeTemplate from "../pages/Users/Home";
import HomePage from "../pages/Users/HomePage/Home";
import Login from "../pages/Users/LoginPage/Login";
import Register from "../pages/Users/RegisterPage/Register";
import Listings from "../pages/Users/Listings/Listings";
import RoomDetail from "../pages/Users/RoomDetail/RoomDetail";
import BookingSuccess from "../pages/Users/BookingSuccess/BookingSuccess";
import Profile from "../pages/Users/Profile/Profile";

//admin
import AdminTemplate from "../pages/Admin/AdminTemplate";
import LoginAdmin from "../pages/Admin/LoginPage/Login";

import Rooms from "../pages/Admin/RoomsManagement/Rooms/Rooms";
import AddRoom from "../pages/Admin/RoomsManagement/AddRoom/AddRoom";
import EditRoom from "../pages/Admin/RoomsManagement/EditRoom/EditRoom";
import RoomAdminDetail from "../pages/Admin/RoomsManagement/RoomDetail/RoomDetail";
import BookRoom from "../pages/Admin/RoomsManagement/BookRoom/BookRoom";
import Users from "../pages/Admin/UsersManagement/Users/Users";
import EditUser from "../pages/Admin/UsersManagement/EditUser/EditUser";
import AddUser from "../pages/Admin/UsersManagement/AddUser/AddUser";
import DetailUser from "../pages/Admin/UsersManagement/DetailUser/DetailUser";
import Locations from "../pages/Admin/LocationsManagment/Locations/Locations";
import AddLocation from "../pages/Admin/LocationsManagment/AddLocation/AddLocation";
import EditLocation from "../pages/Admin/LocationsManagment/EditLocation/EditLocation";
import DetailLocation from "../pages/Admin/LocationsManagment/DetailLocation/DetailLocation";

export type AppRoute = {
    path: string;
    element: React.ReactElement;
    nested?: AppRoute[];
};

export const routes: AppRoute[] = [
    {
        path: "",
        element: <HomeTemplate />,
        nested: [
            {
                path: "",
                element: <HomePage />,
            },
            {
                path: "listings",
                element: <Listings />,
            },
            {
                path: "chi-tiet-phong/:id",
                element: <RoomDetail />,
            },
            {
                path: "dat-phong-thanh-cong",
                element: <BookingSuccess />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
        ],
    },
    {
        path: "admin",
        element: <AdminTemplate />,
        nested: [
            {
                path: "rooms",
                element: <Rooms />
            },
            {
                path: "rooms/add-new",
                element: <AddRoom />
            },
            {
                path: "rooms/edit/:id",
                element: <EditRoom />
            },
            {
                path: "rooms/view/:id",
                element: <RoomAdminDetail />
            },
            {
                path: "book-room",
                element: <BookRoom />
            },
            {
                path: "users",
                element: <Users />
            },
            {
                path: "users/edit/:id",
                element: <EditUser />
            },
            {
                path: "users/view/:id",
                element: <DetailUser />
            },
            {
                path: "users/add-new",
                element: <AddUser />
            },
            {
                path: "locations",
                element: <Locations />
            },
            {
                path: "locations/add-location",
                element: <AddLocation />
            },
            {
                path: "locations/edit/:id",
                element: <EditLocation />
            },
            {
                path: "locations/view/:id",
                element: <DetailLocation />
            }
            
        ]
    },
    // Standalone routes without header/footer
    {
        path: "dangnhap",
        element: <Login />,
        nested: [],
    },
    {
        path: "dangky",
        element: <Register />,
        nested: [],
    },
    {
        path: "admin",
        element: <AdminTemplate />,
        nested: [],
    },
    {
        path: "login-admin",
        element: <LoginAdmin />
    }
];

export const generateRoutes = (routes: AppRoute[]) => {
    return routes.map((route) => {
        if (route.nested && route.nested.length > 0) {
            return (
                <Route path={route.path} element={route.element} key={route.path}>
                    {route.nested.map((nestedRoute) => (
                        <Route
                            path={nestedRoute.path}
                            element={nestedRoute.element}
                            key={nestedRoute.path}
                        />
                    ))}
                </Route>
            );
        }
        return <Route path={route.path} element={route.element} key={route.path} />;
    });
};
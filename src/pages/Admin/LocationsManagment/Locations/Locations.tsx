import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Pagination from "../../Pagination/Pagination"
import ConfirmDeleteDialog from "../../ConfirmDialog/ConfirmDialog"
import {
    resetState,
    delLocations,
    fetchLocationsByPagination,
    setLocationPagination,
} from './slice'
import { type RootState, type AppDispatch } from '../../../store'
import type { Location } from "../../types/Locations"
import { NavLink } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

export default function Locations() {
    const dispatch: AppDispatch = useDispatch()
    const { error, success, loading, locationsFilter, locationPagination } = useSelector((state: RootState) => state.admLocations)
    const [textSearch, setTextSearch] = useState('')
    const [pageIndex, setPageIndex] = useState<number>(locationPagination.pageIndex)

    useEffect(() => {
        resetState()
    }, [])

    useEffect(() => {
        if (locationPagination)
            dispatch(setLocationPagination({ pageIndex: 1, keyword: textSearch }))
    }, [textSearch])

    useEffect(() => {
        if (locationPagination)
            dispatch(setLocationPagination({ pageIndex, keyword: textSearch }))
    }, [pageIndex])

    useEffect(() => {
        dispatch(fetchLocationsByPagination(locationPagination))
    }, [locationPagination?.pageIndex, locationPagination?.keyword])

    useEffect(() => {
        if (success && error !== '') {
            toast.success(error)
        } else if (error !== '') {
            toast.error(error)
        }
        dispatch(resetState())
    }, [error, success])

    const [openDialog, setOpenDialog] = useState(false)
    const [location, setLocation] = useState<Location | null>(null)
    const handleOpenDialog = (data: Location, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setLocation(data)
        setOpenDialog(true)
    }

    const closeDialog = () => {
        setOpenDialog(false)
    }

    const handleOnDelete = async () => {
        if (!location) return
        await dispatch(delLocations(location.id))
        dispatch(fetchLocationsByPagination(locationPagination))
        setOpenDialog(false)
        setLocation(null)
    }

    return (
        <div className="p-6 max-w-full ">
            <div className="flex flex-col justify-between mb-4 gap-3">
                <h1 className="text-2xl font-bold mb-4">Quản lý Vị trí</h1>
                <NavLink
                    to="/admin/locations/add-location"
                    className="bg-transparent cursor-pointer text-black border border-blue-600 px-4 py-2 rounded w-max inline-block text-center"
                >
                    Thêm mới Vị trí
                </NavLink>
            </div>

            <div className="flex flex-col mb-3 ">
                <div className="flex w-full">
                    <input
                        type="text"
                        placeholder="Nhập tên tỉnh thành..."
                        value={textSearch}
                        onChange={(e) => setTextSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm"
                    />
                    <button
                        onClick={() => dispatch(fetchLocationsByPagination(locationPagination))}
                        className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M10 2a8 8 0 015.29 13.71l4.58 4.58a1 1 0 01-1.42 1.42l-4.58-4.58A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z" />
                        </svg>
                    </button>
                </div>

                <table className="w-full mt-6 border border-gray-300 rounded shadow">
                    <thead className="bg-slate-200">
                        <tr>
                            <th className="px-4 py-2 text-left">Tên vị trí</th>
                            <th className="px-4 py-2 text-left">Tỉnh thành</th>
                            <th className="px-4 py-2 text-left">Quốc gia</th>
                            <th className="px-4 py-2 text-left">Hình ảnh</th>
                            <th style={{ width: 150 }}  className="px-4 py-2 text-left">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td className="text-center py-4" colSpan={5}>Đang tải dữ liệu...</td>
                            </tr>
                        ) : locationsFilter && locationsFilter.length ? (
                            locationsFilter.map((location: Location) => (
                                <tr key={location.id} className="hover:bg-gray-100">
                                    <td className="px-4 py-2">{location.tenViTri}</td>
                                    <td className="px-4 py-2">{location.tinhThanh}</td>
                                    <td className="px-4 py-2">{location.quocGia}</td>
                                    <td className="px-4 py-2">
                                        <img
                                            src={location.hinhAnh}
                                            alt={location.tenViTri}
                                            className="w-20 h-14 object-cover rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-2 space-x-2" width={110}>
                                        <NavLink
                                            to={`/admin/locations/edit/${location.id}`}
                                            title="Sửa"
                                            className="inline-block text-blue-500 hover:text-blue-700"
                                        >
                                            ✏️
                                        </NavLink>
                                        <button onClick={(e) => handleOpenDialog(location, e)}>
                                            🗑️
                                        </button>
                                        <NavLink
                                            to={`/admin/locations/view/${location.id}`}
                                            title="Xem chi tiết"
                                            className="inline-block text-green-500 hover:text-green-700"
                                        >
                                            👁️
                                        </NavLink>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4">Không có vị trí nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
            <Pagination pageIndex={locationPagination.pageIndex} totalPages={locationPagination.totalPages} setPage={setPageIndex} />
            <ConfirmDeleteDialog open={openDialog} onClose={closeDialog} onConfirm={handleOnDelete} itemName={location?.tenViTri} />
            <ToastContainer />
        </div>
    )
}

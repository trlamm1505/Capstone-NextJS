import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Pagination from "../../Pagination/Pagination"
import ConfirmDeleteDialog from "../../ConfirmDialog/ConfirmDialog"
import {
  resetState,
  delUsers,
  fetchUsersByPagination,
  setUserPagination,
} from './slice'
import { toast, ToastContainer } from "react-toastify"
import { type RootState, type AppDispatch } from '../../../store'
import type { User } from "../../types/Users"
import { NavLink } from 'react-router-dom'

export default function Users() {
  const dispatch: AppDispatch = useDispatch()
  const { error, success, loading, usersFilter, userPagination } = useSelector((state: RootState) => state.admUsers)
  const [textSearch, setTextSearch] = useState('')
  const [pageIndex, setPageIndex] = useState<number>(userPagination.pageIndex)

  useEffect(() => {
    resetState()
  }, [])

  useEffect(() => {
    if (userPagination)
      dispatch(setUserPagination({ pageIndex: 1, keyword: textSearch }))
  }, [textSearch])

  useEffect(() => {
    if (userPagination)
      dispatch(setUserPagination({ pageIndex, keyword: textSearch }))
  }, [pageIndex])

  useEffect(() => {
    dispatch(fetchUsersByPagination(userPagination))
  }, [userPagination?.pageIndex, userPagination?.keyword])

  useEffect(() => {
    console.log("Data into error:: " + error)
    if (error) {
      if (success) {
        toast.success(error)
        dispatch(resetState())
      } else
        toast.error(error)
    }
  }, [error])

  const [openDialog, setOpenDialog] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const handleOpenDialog = (data: User, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setUser(data)
    setOpenDialog(true)
  }

  const closeDialog = () => {
    setOpenDialog(false)
  }

  const handleOnDelete = async () => {
    if (!user) return
    await dispatch(delUsers(user.id))
    dispatch(fetchUsersByPagination(userPagination))
    setOpenDialog(false)
    setUser(null)
  }

  return (
    <div className="p-6 max-w-full ">
      <div className="flex flex-col justify-between mb-4 gap-3">
        <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>
        <NavLink
          to="/admin/users/add-new"
          className="bg-transparent cursor-pointer text-black border border-blue-600 px-4 py-2 rounded w-max inline-block text-center"
        >
          Thêm mới user
        </NavLink>
      </div>

      <div className="flex flex-col mb-3 ">
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={textSearch}
            onChange={(e) => setTextSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm"
          />
          <button
            onClick={() => dispatch(fetchUsersByPagination(userPagination))}
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
              <th className="px-4 py-2 text-left">Họ tên</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">SĐT</th>
              <th className="px-4 py-2 text-left">Ngày sinh</th>
              <th className="px-4 py-2 text-left">Giới tính</th>
              <th className="px-4 py-2 text-left">Vai trò</th>
              <th className="px-4 py-2 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="text-center " colSpan={7}>Đang tải dữ liệu...</td></tr>
            ) : (usersFilter && usersFilter.length) ? (
              usersFilter.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="px-2 py-2">{user.name}</td>
                  <td className="px-2 py-2">{user.email}</td>
                  <td className="px-2 py-2">{user.phone}</td>
                  <td className="px-2 py-2">{user.birthday}</td>
                  <td className="px-2 py-2">{user.gender ? 'Nam' : 'Nữ'}</td>
                  <td className="px-2 py-2">{user.role}</td>
                  <td width={110} className="px-2 py-2 space-x-2">
                    <NavLink
                      to={`/admin/users/edit/${user.id}`}
                      title="Edit"
                      className="cursor-pointer ml-2 inline-block text-blue-500 hover:text-blue-700"
                    >
                      ✏️
                    </NavLink>
                    <button onClick={(e) => handleOpenDialog(user, e)}>
                      🗑️
                    </button>
                    <NavLink
                      to={`/admin/users/view/${user.id}`}
                      title="View Details"
                      className="inline-block text-green-500 hover:text-green-700"
                    >
                      👁️
                    </NavLink>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7}>Không có người dùng</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination pageIndex={userPagination.pageIndex} totalPages={userPagination.totalPages} setPage={setPageIndex} />
      <ConfirmDeleteDialog open={openDialog} onClose={closeDialog} onConfirm={handleOnDelete} itemName={user?.name} />
      <ToastContainer />
    </div>
  )
}

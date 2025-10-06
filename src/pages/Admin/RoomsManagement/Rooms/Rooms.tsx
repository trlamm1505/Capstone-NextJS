import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast, ToastContainer } from "react-toastify"
import { deleteRoom, loadRoomsPagination, setPagination } from "./slice"
import Pagination from "../../Pagination/Pagination"
import type { AppDispatch } from "../../../store"
import ConfirmDeleteDialog from "../../ConfirmDialog/ConfirmDialog"
import type { Room } from "../../types/Room"

export default function Rooms() {
  const dispatch = useDispatch<AppDispatch>()

  const { rooms, error, success, pagination } = useSelector((state: any) => state.admRooms)
  const [textSearch, setTextSearch] = useState('')

  const [pageIndex, setPageIndex] = useState<number>(pagination.pageIndex)

  useEffect(() => {
    console.log("loadRoomsPagination ", pageIndex)
    dispatch(loadRoomsPagination(pagination))
  }, [pagination?.pageIndex, pagination?.keyword])

  useEffect(() => {
    if (error) {
      if (success) {
        toast.success(error)
        dispatch(loadRoomsPagination(pagination))
      } else
        toast.error(error)
    }
  }, [error])

  useEffect(() => {
    console.log("page changed ", pageIndex)
    if (pagination) {
      dispatch(setPagination({ pageIndex, keyword: textSearch }))
    }
  }, [pageIndex])

  useEffect(() => {
    console.log("page changed ", pageIndex)
    if (pagination) {
      dispatch(setPagination({ pageIndex: 1, keyword: textSearch }))
    }
  }, [textSearch])

  const searchByKeywords = () => {
    dispatch(setPagination({ pageIndex: 1, keyword: textSearch }))
  }


  const [openDialog, setOpenDialog] = useState(false)
  const [room, setRoom] = useState<Room | null>(null)
  const handleOpenDialog = (data: Room, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setRoom(data)
    setOpenDialog(true)
  }

  const closeDialog = () => {
    setOpenDialog(false)
  }

  const handleDelete = () => {
    console.log("handleDelete:: ", room)
    if (!room) return
    dispatch(deleteRoom(room?.id))
    setOpenDialog(false)
    setRoom(null)
  }

  return (
    <div className="p-6">
      <div className="flex flex-col justify-between mb-4 gap-3">
        <h2 className=" block text-2xl font-bold">Danh sách phòng nghỉ dưỡng</h2>
        <NavLink
          to="/admin/rooms/add-new"
          className="bg-transparent cursor-pointer text-black border border-blue-600 px-4 py-2 rounded w-max inline-block text-center"
        >
          Thêm phòng nghỉ
        </NavLink>
      </div>

      <div className="flex w-full mb-3">
        <input
          type="text"
          placeholder="Input search text"
          value={textSearch}
          onChange={(e) => setTextSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <button onClick={searchByKeywords}
          className="cursor-pointer flex items-center justify-center px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
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

      <table className="w-full text-left">
        <thead className="bg-slate-200">
          <tr>
            <th className="p-2">ID</th>
            <th>Hình ảnh</th>
            <th className="w-[20%]">Tên Phòng</th>
            {/* <th>Mô tả</th> */}
            <th>Khách</th>
            <th>Phòng ngủ</th>
            <th>Giường</th>
            <th>Phòng tắm</th>
            <th>Giá tiền ($)</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rooms && Array.isArray(rooms) ? rooms.map((room) => (
            <tr key={room.id} className="hover:bg-gray-50 cursor-pointer" >
              <td className="p-2">{room.id}</td>
              <td>
                <img
                  src={room.hinhAnh}
                  alt={room.tenPhong}
                  className="h-16 w-20 object-cover rounded"
                />
              </td>
              <td className="font-medium">{room.tenPhong}</td>
              <td>{room.khach}</td>
              <td>{room.phongNgu}</td>
              <td>{room.giuong}</td>
              <td>{room.phongTam}</td>
              <td>${room.giaTien}</td>
              <td className="space-x-2 ">
                <NavLink
                  to={`/admin/rooms/edit/${room.id}`}
                  title="Edit"
                  className="cursor-pointer ml-2 inline-block text-blue-500 hover:text-blue-700"
                >
                  ✏️
                </NavLink>
                <button
                  title="Delete"
                  onClick={(e) => handleOpenDialog(room, e)}
                  className="cursor-pointer ml-2 inline-block text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
                <NavLink
                  to={`/admin/rooms/view/${room.id}`}
                  title="View Details"
                  className="inline-block text-green-500 hover:text-green-700"
                >
                  👁️
                </NavLink>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={10} className="text-center text-gray-400 py-4">
                Không có dữ liệu phòng.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination pageIndex={pageIndex} totalPages={pagination.totalPages} setPage={setPageIndex} />
      <ConfirmDeleteDialog open={openDialog} onClose={closeDialog} onConfirm={handleDelete} itemName={room?.tenPhong} />
      <ToastContainer />
    </div>
  )
}

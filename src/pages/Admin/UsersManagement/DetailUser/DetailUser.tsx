import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  convertToISODate,
  fetchUserById,
  resetState,
} from '../Users/slice'
import { toast, ToastContainer } from 'react-toastify'
import { type RootState, type AppDispatch } from '../../../store'
import type { UserForm } from "../../types/Users"
import FormUser from '../FormUser/FormUser'
import { useParams } from 'react-router-dom'
import { getBookRoomByUser } from '../../RoomsManagement/BookRoom/slice'

export default function DetailUser() {
  const dispatch: AppDispatch = useDispatch()
  const { error, success, user } = useSelector((state: RootState) => state.admUsers)
  const { bookRooms } = useSelector((state: RootState) => state.admBookRoom)
  const { rooms } = useSelector((state: RootState) => state.admRooms)

  const [bookRoomsData, setBookRoomsData] = useState<any>([])

  const [action] = useState('chitiet')
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id))
      dispatch(getBookRoomByUser(Number(id)))
      if (bookRooms && rooms) {
        const data = bookRooms.map((booking) => {
          const room = rooms.find((s: any) => Number(s.id) === Number(booking.maPhong))
          if (room)
            return { ...booking, tenPhong: room.tenPhong }
          else
            return booking
        })
        setBookRoomsData(data)
      }
    }
  }, [id])

  useEffect(() => {
    if (id) {
      if (bookRooms && rooms) {
        const data = bookRooms.map((booking) => {

          const room = rooms.find((s: any) => Number(s.id) === Number(booking.maPhong))
          if (room)
            return { ...booking, tenPhong: room.tenPhong }
          else
            return booking
        })
        setBookRoomsData(data)
      }
    }
  }, [bookRooms, rooms])

  const [form, setForm] = useState<UserForm>({
    name: '',
    password: '',
    email: '',
    phone: '',
    birthday: '',
    avatar: '',
    gender: true,
    role: '',
  })

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        password: '',
        email: user.email || '',
        phone: user.phone || '',
        birthday: convertToISODate(user.birthday) || '',
        avatar: user.avatar || '',
        gender: user.gender ?? true,
        role: user.role || '',
      })
    }
  }, [user])

  useEffect(() => {
    if (success && error !== '') {
      toast.success(error)
    } else if (error !== '') {
      toast.error(error)
    }
    dispatch(resetState())
  }, [error, success])
  return (
    <div>
      <FormUser form={form} setForm={setForm} handleChange={() => { }} handleOnAddNew={() => { }} handleOnEdit={() => { }} action={action} title='Chi tiết user' resetForm={() => { }} />
      <div className="min-w-full mx-auto">
        <div className='flex flex-col items-center justify-center p-6 gap-5'>
          <table className="w-full text-left">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-2">Booking ID</th>
                <th>Mã Phòng</th>
                <th>Tên Phòng</th>
                <th>Ngày Đến</th>
                <th>Ngày Đi</th>
                <th>Số Lượng Khách</th>
                <th>Mã Người Dùng</th>
              </tr>
            </thead>
            <tbody>
              {bookRoomsData && Array.isArray(bookRoomsData) && bookRoomsData.length > 0 ? bookRoomsData.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="p-2">{booking.id}</td>
                  <td>{booking.maPhong}</td>
                  <td>{booking.tenPhong}</td>
                  <td>{booking.ngayDen}</td>
                  <td>{booking.ngayDi}</td>
                  <td>{booking.soLuongKhach}</td>
                  <td>{booking.maNguoiDung}</td>
                </tr>
              )) : (
                <tr><td colSpan={6}>Không có dữ liệu</td></tr>
              )}
            </tbody></table>
          <button
            type="button"
            onClick={() => { window.history.back() }}
            className="cursor-pointer bg-orange-300 text-white px-6 py-2 rounded hover:bg-orange-400 transition"
          >
            <b>Quay lại</b>
          </button>
        </div>
      </div>

      <ToastContainer />
    </div >
  )
}

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { AppDispatch } from '../../../store'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllRooms } from '../Rooms/slice'
import { fetchAllUsers } from '../../UsersManagement/Users/slice'
import { toast, ToastContainer } from "react-toastify"
import { bookRoom, clearError } from './slice'
import { fetchAllLocations } from '../../LocationsManagment/Locations/slice'
// const useQuery = () => new URLSearchParams(useLocation().search)


export const bookingSchema = z.object({
    maPhong: z.number().min(1, 'Mã phòng là bắt buộc'),
    ngayDen: z.string().min(1, 'Vui lòng chọn ngày đến'),
    ngayDi: z.string().min(1, 'Vui lòng chọn ngày đi'),
    soLuongKhach: z.number().min(1, 'Phải có ít nhất 1 khách'),
    maNguoiDung: z.number().min(1, 'Mã người dùng là bắt buộc')
})

export type BookingFormValues = z.infer<typeof bookingSchema>

export default function BookRoom() {

    const dispatch = useDispatch<AppDispatch>()
    const { room } = useSelector((state: any) => state.admDetailRoom)

    const { rooms } = useSelector((state: any) => state.admRooms)
    const { usersFilter } = useSelector((state: any) => state.admUsers)
    const { message, success} = useSelector((state: any) => state.admBookRoom)

    const [image, setImage] = useState("")

    useEffect(() => {
        if (message) {
            if (success) {
                toast.success(message)
                reset()
            } else
                toast.error(message)
        }
        dispatch(clearError())
    }, [success, message])
    // useEffect(() => {
    //     if (id) {
    //         dispatch(fetchRoomById(id))
    //     }
    // }, [id])

    useEffect(() => {
        dispatch(fetchAllRooms())
        dispatch(fetchAllUsers())
        dispatch(fetchAllLocations())
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            maPhong: room ? room.id : 0,
            ngayDen: '',
            ngayDi: '',
            soLuongKhach: 1,
            maNguoiDung: 0
        }
    })

    // Khi room chi tiết load set mặc định
    useEffect(() => {
        if (room && room.id) {
              console.log(room, 'room detail loading for....')

            reset({
                maPhong: room.id,
                ngayDen: '',
                ngayDi: '',
                soLuongKhach: 1,
                maNguoiDung: 0
            })
            if (room.hinhAnh) {
                setImage(room.hinhAnh)
            }
        } else {
            reset({
                maPhong: rooms[0]?.id,
                ngayDen: '',
                ngayDi: '',
                soLuongKhach: 1,
                maNguoiDung: 0
            })
            if (rooms[0].hinhAnh) {
                setImage(rooms[0].hinhAnh)
            }
        }
    }, [room, reset])

    const onSubmit = (data: BookingFormValues) => {
        console.log('Dữ liệu đặt phòng:', data)
        dispatch(bookRoom(data))
    }

    const handleChangeRooms = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value)
        if (!isNaN(selectedId) && selectedId > 0) {
            setValue('maPhong', selectedId, { shouldValidate: true, shouldDirty: true })

            const selectedRoom = rooms.find((r: any) => r.id === selectedId)
            if (selectedRoom && selectedRoom.hinhAnh) {
                setImage(selectedRoom.hinhAnh)
            } else {
                setImage("")
            }
        } else {
            setImage("")
            setValue('maPhong', 0, { shouldValidate: true, shouldDirty: true })
        }
    }

    return (
        <div className="mx-auto mt-10 max-w-full bg-white px-10 pb-20 rounded shadow ">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Đặt Phòng</h2>
            <div className='grid grid-cols-10 justify-center gap-2 w-full '>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="col-span-5 p-6 bg-white shadow-md rounded-md space-y-6"
                >
                    <div>
                        <select
                            {...register('maPhong', { valueAsNumber: true, required: "Vui lòng chọn phòng" })}
                            onChange={(e) => {
                                handleChangeRooms(e)
                            }}
                            // value={room?.id}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="0">-- Chọn phòng --</option>
                            {rooms && Array.isArray(rooms) && rooms.map((r: any) => (
                                <option key={r.id} value={r.id}>
                                    {r.tenPhong}
                                </option>
                            ))}
                        </select>
                        {errors.maPhong && (
                            <p className="text-sm text-red-500 mt-1">{errors.maPhong.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đến</label>
                        <input
                            type="datetime-local"
                            {...register('ngayDen')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.ngayDen && (
                            <p className="text-sm text-red-500 mt-1">{errors.ngayDen.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đi</label>
                        <input
                            type="datetime-local"
                            {...register('ngayDi')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.ngayDi && (
                            <p className="text-sm text-red-500 mt-1">{errors.ngayDi.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng khách</label>
                        <input
                            type="number"
                            {...register('soLuongKhach', { valueAsNumber: true })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.soLuongKhach && (
                            <p className="text-sm text-red-500 mt-1">{errors.soLuongKhach.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Người dùng</label>
                        {/* <input
                            type="number"
                            {...register('maNguoiDung', { valueAsNumber: true })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        /> */}
                        <select
                            {...register('maNguoiDung', { valueAsNumber: true, required: "Vui lòng chọn người dùng" })}
                            // onChange={(e) => {
                            //     handleChangeRooms(e)
                            // }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="0">-- Chọn người dùng --</option>
                            {usersFilter && Array.isArray(usersFilter) && usersFilter.map((r: any) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                        {errors.maNguoiDung && (
                            <p className="text-sm text-red-500 mt-1">{errors.maNguoiDung.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Đặt phòng
                    </button>
                </form>

                <div className='col-span-5  flex items-center justify-center' >
                    {image &&
                        <div className='w-full h-full'>
                            <img src={image}
                                alt={image}
                                className="h-full w-full object-cover rounded" />
                        </div>
                    }

                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

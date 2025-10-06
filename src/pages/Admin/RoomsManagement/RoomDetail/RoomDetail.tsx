import { useEffect } from "react"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast, ToastContainer } from "react-toastify"
import type { RoomFormData } from "../../types/Room"
import { useDispatch, useSelector } from "react-redux"
import { clearError, fetchRoomById } from "./slice"
import type { AppDispatch } from "../../../store"
import { useNavigate, useParams } from "react-router-dom"
import { fetchAllLocations } from "../../LocationsManagment/Locations/slice"

export const roomSchema = z.object({
  tenPhong: z.string().min(1, "Tên phòng không được để trống"),
  khach: z.number().min(1, "Số khách tối thiểu là 1"),
  phongNgu: z.number().min(0),
  giuong: z.number().min(0),
  phongTam: z.number().min(0),
  moTa: z.string().min(10, "Mô tả ít nhất 10 ký tự"),
  giaTien: z.number().min(1, "Giá tiền không hợp lệ"),
  mayGiat: z.boolean(),
  banLa: z.boolean(),
  tivi: z.boolean(),
  dieuHoa: z.boolean(),
  wifi: z.boolean(),
  bep: z.boolean(),
  doXe: z.boolean(),
  hoBoi: z.boolean(),
  banUi: z.boolean(),
  maViTri: z.number().min(1, "Mã vị trí không hợp lệ"),
  hinhAnh: z.string().url("URL hình ảnh không hợp lệ"),
})

const amenities: { value: keyof RoomFormData; name: string }[] = [
  { value: "mayGiat", name: "Máy Giặt" },
  { value: "banLa", name: "Bàn Là" },
  { value: "tivi", name: "Tivi" },
  { value: "dieuHoa", name: "Điều Hòa" },
  { value: "wifi", name: "Wifi" },
  { value: "bep", name: "Bếp" },
  { value: "doXe", name: "Đỗ Xe" },
  { value: "hoBoi", name: "Hồ Bơi" },
  { value: "banUi", name: "Bàn Ủi" },
]

const defaultValues = {
  tenPhong: "",
  khach: 1,
  phongNgu: 1,
  giuong: 1,
  phongTam: 1,
  moTa: "",
  giaTien: 0,
  maViTri: 1,
  hinhAnh: "",
  mayGiat: false,
  banLa: false,
  tivi: false,
  dieuHoa: false,
  wifi: false,
  bep: false,
  doXe: false,
  hoBoi: false,
  banUi: false,
}

export default function RoomAdminDetail() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { room, message, success } = useSelector((state: any) => state.admDetailRoom)
  const { locations } = useSelector((state: any) => state.admLocations)
  
  useEffect(() => {
    if (id) {
      dispatch(fetchRoomById(id))
         dispatch(fetchAllLocations())
    }
  }, [id])

  const {
    register,
    reset,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: defaultValues,
  })

  useEffect(() => {
    if (room) {
      reset({
        tenPhong: room.tenPhong,
        khach: room.khach,
        phongNgu: room.phongNgu,
        giuong: room.giuong,
        phongTam: room.phongTam,
        moTa: room.moTa,
        giaTien: room.giaTien,
        maViTri: room.maViTri,
        hinhAnh: room.hinhAnh,
        mayGiat: room.mayGiat,
        banLa: room.banLa,
        tivi: room.tivi,
        dieuHoa: room.dieuHoa,
        wifi: room.wifi,
        bep: room.bep,
        doXe: room.doXe,
        hoBoi: room.hoBoi,
        banUi: room.banUi,
      })

      console.log("Fill Room :", room)
    }
  }, [room, reset])

  useEffect(() => {
    if (message) {
      if (success) {
        toast.success(message)
        resetForm()
      } else
        toast.error(message)
    }
  }, [success, message])


  const resetForm = () => {
    clearError()
    reset(defaultValues)
  }

  const back = () => {
    window.history.back()
  }

  const gotoBookRoom = () => {
    navigate(`/admin/book-room`)
  }

  return (
    <div className="mx-auto mt-10 max-w-full bg-white px-10 pb-10 rounded shadow flex flex-col items-center">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Thông tin phòng</h2>

      <div className="grid grid-cols-10 gap-8 ">
        <form className="col-span-5  space-y-6">
          {/* Tên phòng */}
          <div>
            <label htmlFor="tenPhong" className="block font-medium mb-1 text-gray-700">
              Tên phòng
            </label>
            <input
              id="tenPhong"
              {...register("tenPhong")}
              disabled
              className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            {errors.tenPhong && (
              <p className="text-red-500 text-sm mt-1">{errors.tenPhong.message}</p>
            )}
          </div>

          {/* Number inputs grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="khach" className="block font-medium mb-1 text-gray-700">
                Số khách
              </label>
              <input
                id="khach"
                type="number"
                {...register("khach", { valueAsNumber: true })}
                disabled
                className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="phongNgu" className="block font-medium mb-1 text-gray-700">
                Phòng ngủ
              </label>
              <input
                id="phongNgu"
                type="number"
                {...register("phongNgu", { valueAsNumber: true })}
                disabled
                className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="giuong" className="block font-medium mb-1 text-gray-700">
                Giường
              </label>
              <input
                id="giuong"
                type="number"
                {...register("giuong", { valueAsNumber: true })}
                disabled
                className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="phongTam" className="block font-medium mb-1 text-gray-700">
                Phòng tắm
              </label>
              <input
                id="phongTam"
                type="number"
                {...register("phongTam", { valueAsNumber: true })}
                disabled
                className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="giaTien" className="block font-medium mb-1 text-gray-700">
                Giá tiền (USD)
              </label>
              <input
                id="giaTien"
                type="number"
                {...register("giaTien", { valueAsNumber: true })}
                readOnly
                className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="maViTri" className="block font-medium mb-1 text-gray-700">
                Vị trí
              </label>
              <select
                {...register('maViTri', { valueAsNumber: true, required: "Vui lòng chọn Vị trí" })}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              >
                <option value="0">-- Chọn vị trí --</option>
                {locations && Array.isArray(locations) && locations.map((r: any) => (
                  <option key={r.id} value={r.id}>
                    {r.tenViTri}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label htmlFor="moTa" className="block font-medium mb-1 text-gray-700">
              Mô tả
            </label>
            <textarea
              id="moTa"
              {...register("moTa")}
              rows={4}
              disabled
              className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            {errors.moTa && (
              <p className="text-red-500 text-sm mt-1">{errors.moTa.message}</p>
            )}
          </div>

          {/* Hình ảnh URL */}
          <div>
            <label htmlFor="hinhAnh" className="block font-medium mb-1 text-gray-700">
              Hình ảnh (URL)
            </label>
            <input
              id="hinhAnh"
              type="text"
              {...register("hinhAnh")}
              disabled
              className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            {errors.hinhAnh && (
              <p className="text-red-500 text-sm mt-1">{errors.hinhAnh.message}</p>
            )}
          </div>

          {/* Boolean checkboxes for amenities */}
          <div>
            <h3 className="font-semibold mb-2 text-gray-700">Tiện ích</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {amenities.map(({ value, name }) => (
                <label
                  key={value}
                  htmlFor={value}
                  className="flex items-center space-x-2 text-gray-700"
                >
                  <input
                    type="checkbox"
                    id={value}
                    {...register(value)}
                    disabled
                    className="form-checkbox h-5 w-5 text-blue-600 disabled:cursor-not-allowed"
                  />
                  <span className="text-gray-500">{name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={gotoBookRoom}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded cursor-poiter"
            >
              <b>Đặt phòng</b>
            </button>
            <button
              type="button"
              onClick={back}
              className="cursor-pointer bg-orange-300 text-white px-6 py-2 rounded hover:bg-orange-400 transition"
            >
              <b>Quay lại</b>
            </button>
          </div>
        </form>

        <div className='col-span-5 flex items-center justify-center py-7' >
          {room?.hinhAnh &&
            <div className='w-full h-full'>
              <img src={room.hinhAnh}
                alt={room.hinhAnh}
                className="h-full w-full object-cover rounded" />
            </div>
          }

        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

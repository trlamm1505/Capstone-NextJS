import { useEffect } from "react"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast, ToastContainer } from "react-toastify"
import type { RoomFormData } from "../../types/Room"
import { useDispatch, useSelector } from "react-redux"
import { addRoom, clearError } from "./slice"
import type { AppDispatch } from "../../../store"
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

const amenities: { value: keyof RoomFormData, name: string }[] = [
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

export default function AddRoom() {

  const dispatch = useDispatch<AppDispatch>()

  const { message, success } = useSelector((state: any) => state.admRoom)
  const { locations } = useSelector((state: any) => state.admLocations)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: defaultValues,
  })

  const hinhAnh = watch("hinhAnh")

   useEffect(() => {
    dispatch(fetchAllLocations())
  }, [])

  useEffect(() => {
    if (message) {
      if (success) {
        toast.success(message)
        resetForm()
      } else
        toast.error(message)
    }
    dispatch(clearError())
  }, [success, message])

  const onSubmit = (data: RoomFormData) => {
    console.log("Submitted Room:", data)
    dispatch(addRoom(data))
  }

  const resetForm = () => {
    clearError()
    reset(defaultValues)
  }

  const back = () => {
    window.history.back()
  }

  return (
    <div className="mx-auto mt-10 max-w-3xl bg-white px-10 py-8 rounded shadow">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Thêm phòng mới</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tên phòng */}
        <div>
          <label htmlFor="tenPhong" className="block font-medium mb-1 text-gray-700">
            Tên phòng
          </label>
          <input
            id="tenPhong"
            {...register("tenPhong")}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {errors.khach && (
              <p className="text-red-500 text-sm mt-1">{errors.khach.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="phongNgu" className="block font-medium mb-1 text-gray-700">
              Phòng ngủ
            </label>
            <input
              id="phongNgu"
              type="number"
              {...register("phongNgu", { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded px-4 py-2"
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
              className="w-full border border-gray-300 rounded px-4 py-2"
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
              className="w-full border border-gray-300 rounded px-4 py-2"
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
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {errors.giaTien && (
              <p className="text-red-500 text-sm mt-1">{errors.giaTien.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="maViTri" className="block font-medium mb-1 text-gray-700">
              Vị trí
            </label>

            <select
              {...register('maViTri', { valueAsNumber: true, required: "Vui lòng chọn Vị trí" })}
              // onChange={(e) => {
              //   handleChangeRooms(e)
              // }}
              // value={room?.id}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="0">-- Chọn vị trí --</option>
              {locations && Array.isArray(locations) && locations.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.tenViTri}
                </option>
              ))}
            </select>
            {errors.maViTri && (
              <p className="text-sm text-red-500 mt-1">{errors.maViTri.message}</p>
            )}

            {/* <input
              id="maViTri"
              type="number"
              {...register("maViTri", { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded px-4 py-2"
            /> */}

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
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          {errors.moTa && (
            <p className="text-red-500 text-sm mt-1">{errors.moTa.message}</p>
          )}
        </div>

        {/* Hình ảnh URL */}
        <div className="flex flex-row justify-between gap-2">
          <div className="flex-1">
            <label htmlFor="hinhAnh" className="block font-medium mb-1 text-gray-700">
              Hình ảnh (URL)
            </label>
            <input
              id="hinhAnh"
              type="text"
              {...register("hinhAnh")}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {errors.hinhAnh && (
              <p className="text-red-500 text-sm mt-1">{errors.hinhAnh.message}</p>
            )}
          </div>


          {hinhAnh &&
            <div className="w-[100px] h-[100px] overflow-hidden rounded">
              <img src={hinhAnh}
                alt={hinhAnh}
                className="w-full h-full object-cover" />
            </div>
          }

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
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span>{name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition mr-2.5"
        >
          Thêm Phòng
        </button>
        <button
          type="button"
          onClick={back}
          className="bg-orange-300 text-white px-6 py-2 rounded hover:bg-orange-500 transition"
        >
          Quay lại
        </button>

      </form>
      <ToastContainer />
    </div>
  )
}

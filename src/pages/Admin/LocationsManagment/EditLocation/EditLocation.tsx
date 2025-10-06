import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  editLocation,
  fetchLocationById,
} from '../Locations/slice'
import { z } from 'zod'
import { toast, ToastContainer } from 'react-toastify'
import { type RootState, type AppDispatch } from '../../../store'
import type { LocationForm } from "../../types/Locations"
import FormLocation from '../FormLocation/FormLocation'
import { useParams } from 'react-router-dom'
import { SUA, THEM_MOI } from '../../types/Constant'

// Zod schema for validation
const locationSchema = z.object({
  tenViTri: z.string().nonempty('Tên vị trí không được để trống'),
  tinhThanh: z.string().nonempty('Tỉnh thành không được để trống'),
  quocGia: z.string().nonempty('Quốc gia không được để trống'),
  hinhAnh: z.string().url('Hình ảnh phải là một URL hợp lệ'),
})

export default function EditLocation() {
  const dispatch: AppDispatch = useDispatch()
  const { error, success, location } = useSelector((state: RootState) => state.admLocations)
  const [action, setAction] = useState<string>(SUA)
  const { id } = useParams<{ id: string }>()

  const [form, setForm] = useState<LocationForm>({
    tenViTri: '',
    tinhThanh: '',
    quocGia: '',
    hinhAnh: ''
  })

  // Fetch location data
  useEffect(() => {
    if (id) {
      dispatch(fetchLocationById(Number(id)))
    }
  }, [id])

  // Set form when data is loaded
  useEffect(() => {
    if (location) {
      setForm({
        tenViTri: location.tenViTri || '',
        tinhThanh: location.tinhThanh || '',
        quocGia: location.quocGia || '',
        hinhAnh: location.hinhAnh || ''
      })
    }
  }, [location])

  useEffect(() => {
    if (success && error !== '') {
      toast.success(error)
      back()
    } else if (error !== '') {
      toast.error(error)
    }
  }, [error, success])

  const back = () => {
    window.history.back()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    let val: string | number = value

    setForm({ ...form, [name]: val })
  }

  const resetForm = () => {
    setForm({
      tenViTri: '',
      tinhThanh: '',
      quocGia: '',
      hinhAnh: '',
    })
    setAction(THEM_MOI)
  }

  const handlePayload = () => {
    const result = locationSchema.safeParse(form)
    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0]
      toast.error(firstError || 'Dữ liệu không hợp lệ')
      return null
    }
    return result.data
  }

  const handleOnEdit = async (e: FormEvent) => {
    e.preventDefault()
    setAction(SUA)
    const payload = handlePayload()
    if (!payload) return
    await dispatch(editLocation({...payload, id: Number(id)}))
    resetForm()
  }

  return (
    <div>
      <FormLocation
        form={form}
        setForm={setForm}
        handleChange={handleChange}
        handleOnAddNew={() => {}}
        handleOnEdit={handleOnEdit}
        action={action}
        resetForm={resetForm}
        title={'Chỉnh sửa địa điểm'}
      />
      <ToastContainer />
    </div>
  )
}

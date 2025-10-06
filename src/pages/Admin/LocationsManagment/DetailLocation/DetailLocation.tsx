import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchLocationById,
  resetState,
} from '../Locations/slice'
import { toast, ToastContainer } from 'react-toastify'
import { type RootState, type AppDispatch } from '../../../store'
import type { LocationForm } from "../../types/Locations"
import FormLocation from '../FormLocation/FormLocation'
import { useParams } from 'react-router-dom'
import { CHI_TIET } from '../../types/Constant'

export default function DetailLocation() {
  const dispatch: AppDispatch = useDispatch()
  const { error, success, location } = useSelector((state: RootState) => state.admLocations)

  const [action] = useState(CHI_TIET)

  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (id) {
      dispatch(fetchLocationById(Number(id)))
    }
  }, [id])

  const [form, setForm] = useState<LocationForm>({
    tenViTri: '',
    tinhThanh: '',
    quocGia: '',
    hinhAnh: ''
  })

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
    } else if (error !== '') {
      toast.error(error)
    }
    dispatch(resetState())
  }, [error, success])

  return (
    <div className='flex flex-col items-center py-6'>
      <FormLocation
        form={form}
        setForm={setForm}
        handleChange={() => { }}
        handleOnAddNew={() => { }}
        handleOnEdit={() => { }}
        action={action}
        title="Chi tiết địa điểm"
        resetForm={() => { }}
      />

      <button
        type="button"
        onClick={() => { window.history.back() }}
        className="cursor-pointer bg-orange-300 text-white px-6 py-2 rounded hover:bg-orange-400 transition"
      >
        <b>Quay lại</b>
      </button>

      <ToastContainer />
    </div>
  )
}

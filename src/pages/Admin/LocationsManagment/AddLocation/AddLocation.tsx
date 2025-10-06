import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    addLocation,
    resetState,
} from '../Locations/slice'
import { z } from 'zod'
import { toast, ToastContainer } from 'react-toastify'
import { type RootState, type AppDispatch } from '../../../store'
import { type LocationForm } from "../../types/Locations"
import FormLocation from '../FormLocation/FormLocation'
import { THEM_MOI } from '../../types/Constant'

const locationSchema = z.object({
    tenViTri: z.string().nonempty('Tên vị trí không được để trống'),
    tinhThanh: z.string().nonempty('Tỉnh thành không được để trống'),
    quocGia: z.string().nonempty('Quốc gia không được để trống'),
    hinhAnh: z.string().url('Hình ảnh phải là một URL hợp lệ'),
})

export default function AddLocation() {

    const dispatch: AppDispatch = useDispatch()
    const { error, success } = useSelector((state: RootState) => state.admLocations)
    const [action, setAction] = useState<string>(THEM_MOI)

    const [form, setForm] = useState<LocationForm>({
        tenViTri: '',
        tinhThanh: '',
        quocGia: '',
        hinhAnh: '',
    })

    useEffect(() => {
        console.log("success: " + success + " error: " + error)
        if (success && error !== '') {
            toast.success(error)
            dispatch(resetState())
            // back()
        } else if (error !== '') {
            toast.error(error)
        }
    }, [error, success])

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

    const handleOnAddNew = async (e: FormEvent) => {
        e.preventDefault()
        setAction(THEM_MOI)
        const payload = handlePayload()
        if (!payload) return
        await dispatch(addLocation(payload))
    }

    return (
        <div>
            <FormLocation
                form={form}
                setForm={setForm}
                handleChange={handleChange}
                handleOnAddNew={handleOnAddNew}
                handleOnEdit={() => {}}
                action={action}
                resetForm={resetForm}
                title={'Thêm mới địa điểm'}
            />
            <ToastContainer />
        </div>
    )
}

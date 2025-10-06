import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    addUser,
    resetState,
} from '../Users/slice'
import { z } from 'zod'
import { toast, ToastContainer } from 'react-toastify'
import { type RootState, type AppDispatch } from '../../../store'
import type { UserForm } from "../../types/Users"
import FormUser from '../FormUser/FormUser'
import { THEM_MOI } from '../../types/Constant'

const userSchema = z.object({
    name: z.string().nonempty('Họ tên không được để trống'),
    password: z.string().nonempty('Mật khẩu không được để trống'),
    email: z.string().email('Email không đúng định dạng'),
    phone: z.string().regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số'),
    birthday: z.string().nonempty('Ngày sinh không được để trống'),
    // avatar: z.string().url('Ảnh đại diện phải là một URL hợp lệ').optional(),
    gender: z.boolean(),
    role: z.enum(['ADMIN', 'USER']).or(z.string().nonempty('Vai trò không được để trống')),
})

export default function AddUser() {

    const dispatch: AppDispatch = useDispatch()
    const { error, success } = useSelector((state: RootState) => state.admUsers)
    const [action, setAction] = useState<string>(THEM_MOI)

    const [form, setForm] = useState<UserForm>({
        name: '',
        password: '',
        email: '',
        phone: '',
        birthday: '',
        // avatar: '',
        gender: true,
        role: '',
    })
    useEffect(() => {
        if (error) {
            if (success) {
                toast.success(error)
                dispatch(resetState())
                // back()
            } else
                toast.error(error)
        }
    }, [error])

    // const back = () => {
    //     window.history.back()
    // }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        let val: string | boolean = value
        if (type === 'checkbox' && 'checked' in e.target) {
            val = (e.target as HTMLInputElement).checked
        }
        setForm({ ...form, [name]: val })
    }

    const resetForm = () => {
        setForm({
            name: '',
            password: '',
            email: '',
            phone: '',
            birthday: '',
            // avatar: '',
            gender: true,
            role: '',
        })
        setAction(THEM_MOI)
    }

    const handlePayload = () => {
        const result = userSchema.safeParse(form)
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
        await dispatch(addUser(payload))
    }

    const handleOnEdit = async () => {
    }

    return (
        <div>
            <FormUser form={form} setForm={setForm} handleChange={handleChange} handleOnAddNew={handleOnAddNew} handleOnEdit={handleOnEdit} action={action} resetForm={resetForm} title={'Thêm mới user'} />
            <ToastContainer />
        </div>
    )
}

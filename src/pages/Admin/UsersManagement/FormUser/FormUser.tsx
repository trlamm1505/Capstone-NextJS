import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import type { UserAction, UserForm, UserFormEdit } from '../../types/Users';
import { ArrowLeftIcon } from 'lucide-react';

type Props = {
  form: UserForm;
  setForm: React.Dispatch<React.SetStateAction<UserFormEdit | UserForm>>;
  action: UserAction;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleOnAddNew: (e: FormEvent) => void;
  handleOnEdit: (e: FormEvent) => void;
  resetForm: () => void;
  title: string;
};

export default function FormUser({ form, setForm, handleChange, handleOnAddNew, handleOnEdit, action, resetForm, title }: Props) {

  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    setDisabled(action === 'chitiet');
  }, [action]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="flex items-center justify-start text-2xl font-bold mb-4">
        <ArrowLeftIcon onClick={() => window.history.back()} className="cursor-pointer text-blue h-5 w-5 mr-2" />
        {title ? title : 'Quản lý người dùng'}
      </h1>

      <form className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Họ tên */}
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 text-sm font-medium text-gray-700">Họ tên</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập họ tên"
              disabled={disabled}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Mật khẩu */}
          {action !== 'sua' && action !== 'chitiet' && (
            <div className="flex flex-col">
              <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">Mật khẩu</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              disabled={disabled}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Số điện thoại */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-1 text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              id="phone"
              name="phone"
              value={form.phone || ''}
              onChange={handleChange}
              placeholder="0123456789"
              disabled={disabled}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Ngày sinh */}
          <div className="flex flex-col">
            <label htmlFor="birthday" className="mb-1 text-sm font-medium text-gray-700">Ngày sinh</label>
            <input
              id="birthday"
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              disabled={disabled}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Giới tính */}
          <div className="flex flex-col">
            <label htmlFor="gender" className="mb-1 text-sm font-medium text-gray-700">Giới tính</label>
            <select
              id="gender"
              name="gender"
              value={form.gender ? 'true' : 'false'}
              onChange={(e) => setForm({ ...form, gender: e.target.value === 'true' })}
              disabled={disabled}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="true">Nam</option>
              <option value="false">Nữ</option>
            </select>
          </div>

          {/* Ảnh đại diện */}

          {/* <div className="flex flex-col ">
            <label htmlFor="avatar" className="mb-1 text-sm font-medium text-gray-700">Link ảnh đại diện</label>
            <input
              id="avatar"
              name="avatar"
              value={form.avatar || ''}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              disabled={disabled}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div> */}

          {/* Vai trò */}
          <div className="flex flex-col">
            <label htmlFor="role" className="mb-1 text-sm font-medium text-gray-700">Vai trò</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={disabled}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Chọn vai trò --</option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
          </div>


          {/* {form?.avatar &&
            <div className="flex flex-col mb-3 justify-start">
              <div className="w-[150px] h-[150px] overflow-hidden rounded-full">
                <img src={form.avatar}
                  alt={form.avatar}
                  className="w-full h-full object-cover" />
              </div>
            </div>
          } */}

        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          {action === 'themmoi' && (
            <>
              <button
                type="button"
                onClick={handleOnAddNew}
                disabled={disabled}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Thêm người dùng
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={disabled}
                className={`bg-orange-300 hover:bg-orange-400 text-white px-4 py-2 rounded-md ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Reset
              </button>
            </>
          )}

          {action === 'sua' && (
            <button
              type="button"
              onClick={handleOnEdit}
              disabled={disabled}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cập nhật
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
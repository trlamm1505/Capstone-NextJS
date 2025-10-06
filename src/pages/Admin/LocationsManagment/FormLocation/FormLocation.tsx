import React, { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import type { LocationForm} from '../../types/Locations'
import { ArrowLeftIcon } from 'lucide-react'
import { CHI_TIET } from '../../types/Constant'

type Props = {
  form: LocationForm
  setForm: React.Dispatch<React.SetStateAction<LocationForm>>
  action: string
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleOnAddNew: (e: FormEvent) => void
  handleOnEdit: (e: FormEvent) => void
  resetForm: () => void
  title: string
}

export default function FormLocation({
  form,
  handleChange,
  handleOnAddNew,
  handleOnEdit,
  action,
  resetForm,
  title,
}: Props) {
  const [disabled, setDisabled] = useState(false)
  const leftForm = useRef<HTMLDivElement>(null)
  const [highForm, setHighForm] = useState<string>()


  useEffect(() => {
    setHighForm(leftForm.current?.offsetHeight + 'px')

    setDisabled(action === CHI_TIET)
  }, [action])

  return (
    <div className="p-6 min-w-full mx-auto">
      <h1 className="flex items-center justify-start text-2xl font-bold mb-4">
        <ArrowLeftIcon onClick={() => window.history.back()} className="cursor-pointer text-blue h-5 w-5 mr-2" />
        {title || 'Quản lý vị trí'}
      </h1>

      <div className="grid grid-cols-10 gap-8 ">
        <div ref={leftForm} className="col-span-5 space-y-6">
          <form className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col space-y-4">

              {/* Tên vị trí */}
              <div className="flex flex-col">
                <label htmlFor="tenViTri" className="mb-1 text-sm font-medium text-gray-700">Tên vị trí</label>
                <input
                  id="tenViTri"
                  name="tenViTri"
                  value={form.tenViTri}
                  onChange={handleChange}
                  placeholder="Nhập tên vị trí"
                  disabled={disabled}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Tỉnh thành */}
              <div className="flex flex-col">
                <label htmlFor="tinhThanh" className="mb-1 text-sm font-medium text-gray-700">Tỉnh thành</label>
                <input
                  id="tinhThanh"
                  name="tinhThanh"
                  value={form.tinhThanh}
                  onChange={handleChange}
                  placeholder="Nhập tỉnh thành"
                  disabled={disabled}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Quốc gia */}
              <div className="flex flex-col">
                <label htmlFor="quocGia" className="mb-1 text-sm font-medium text-gray-700">Quốc gia</label>
                <input
                  id="quocGia"
                  name="quocGia"
                  value={form.quocGia}
                  onChange={handleChange}
                  placeholder="Nhập quốc gia"
                  disabled={disabled}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Hình ảnh */}
              <div className="flex flex-col">
                <label htmlFor="hinhAnh" className="mb-1 text-sm font-medium text-gray-700">Link hình ảnh</label>
                <input
                  id="hinhAnh"
                  name="hinhAnh"
                  value={form.hinhAnh}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  disabled={disabled}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
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
                    Thêm vị trí
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
        <div className='col-span-5 flex items-center justify-center' >
          {form?.hinhAnh &&
            <div className='w-full h-full'>
              <img src={form.hinhAnh}
                alt={form.hinhAnh}
                className="h-full object-cover rounded" style={{height: highForm}} />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

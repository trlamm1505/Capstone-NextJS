import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, clearError, clearSuccess, checkEmailExists, resetEmailCheck } from './slice';
import type { AppDispatch } from '../../store';

// Form types
interface RegisterForm {
    matKhau: string;
    xacNhanMatKhau: string;
    email: string;
    hoTen: string;
    soDT: string;
}

interface FormErrors {
    matKhau?: string;
    xacNhanMatKhau?: string;
    email?: string;
    hoTen?: string;
    soDT?: string;
}

type RegisterSliceState = { loading: boolean; error: string | null; success: boolean };

function Register() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, success, emailChecking, emailTaken } = useSelector((state: any) => state.register);

    const [formData, setFormData] = useState<RegisterForm>({
        matKhau: '',
        xacNhanMatKhau: '',
        email: '',
        hoTen: '',
        soDT: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        dispatch(clearError());
        dispatch(clearSuccess());
        dispatch(resetEmailCheck());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            // Small delay to ensure state has flushed before route change
            const t = setTimeout(() => {
                navigate('/dangnhap', { replace: true });
                dispatch(clearSuccess());
            }, 100);
            return () => clearTimeout(t);
        }
    }, [success, navigate, dispatch]);

    // Debug logging for error
    useEffect(() => {
        if (error) {
            console.log('Register component - Error received:', error);
            console.log('Register component - Error type:', typeof error);
        }
    }, [error]);

    // Validation functions
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!formData.matKhau.trim()) {
            newErrors.matKhau = 'Mật khẩu không được để trống';
        }
        if (!formData.xacNhanMatKhau.trim()) {
            newErrors.xacNhanMatKhau = 'Vui lòng nhập lại mật khẩu';
        } else if (formData.xacNhanMatKhau !== formData.matKhau) {
            newErrors.xacNhanMatKhau = 'Mật khẩu nhập lại không khớp';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email không hợp lệ (VD: example@gmail.com)';
        }

        if (!formData.hoTen.trim()) {
            newErrors.hoTen = 'Họ tên không được để trống';
        }

        if (!formData.soDT.trim()) {
            newErrors.soDT = 'Số điện thoại không được để trống';
        } else if (!validatePhone(formData.soDT)) {
            newErrors.soDT = 'Số điện thoại phải có đúng 10 chữ số';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Map form fields to signup payload
        const payload = {
            name: formData.hoTen,
            email: formData.email,
            password: formData.matKhau,
            phone: formData.soDT,
            // Optionals based on API doc
            gender: true,
            role: 'USER',
        };

        dispatch(registerUser(payload));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        validateField(name as keyof RegisterForm, value);

        if (name === 'email') {
            if (value && value.includes('@')) {
                dispatch(checkEmailExists(value));
            } else {
                dispatch(resetEmailCheck());
            }
        }
    };

    const validateField = (fieldName: keyof RegisterForm, value: string) => {
        const newErrors: FormErrors = { ...errors };

        switch (fieldName) {
            case 'matKhau':
                if (!value.trim()) newErrors.matKhau = 'Mật khẩu không được để trống';
                else delete newErrors.matKhau;
                // also re-validate confirm password if exists
                if (formData.xacNhanMatKhau && value !== formData.xacNhanMatKhau) {
                    newErrors.xacNhanMatKhau = 'Mật khẩu nhập lại không khớp';
                } else if (formData.xacNhanMatKhau) {
                    delete newErrors.xacNhanMatKhau;
                }
                break;
            case 'xacNhanMatKhau':
                if (!value.trim()) newErrors.xacNhanMatKhau = 'Vui lòng nhập lại mật khẩu';
                else if (value !== formData.matKhau) newErrors.xacNhanMatKhau = 'Mật khẩu nhập lại không khớp';
                else delete newErrors.xacNhanMatKhau;
                break;
            case 'email':
                if (!value.trim()) newErrors.email = 'Email không được để trống';
                else if (!validateEmail(value)) newErrors.email = 'Email không hợp lệ (VD: example@gmail.com)';
                else delete newErrors.email;
                break;
            case 'hoTen':
                if (!value.trim()) newErrors.hoTen = 'Họ tên không được để trống';
                else delete newErrors.hoTen;
                break;
            case 'soDT':
                if (!value.trim()) newErrors.soDT = 'Số điện thoại không được để trống';
                else if (!validatePhone(value)) newErrors.soDT = 'Số điện thoại phải có đúng 10 chữ số';
                else delete newErrors.soDT;
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Đăng Ký
                    </h2>
                    <p className="text-gray-300">
                        Tạo tài khoản mới
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        {/* Full Name - moved to top */}
                        <div>
                            <label htmlFor="hoTen" className="block text-sm font-medium text-gray-300 mb-2">
                                Họ tên
                            </label>
                            <input
                                id="hoTen"
                                name="hoTen"
                                type="text"
                                required
                                value={formData.hoTen}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 ${errors.hoTen ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Nhập họ tên"
                            />
                            {errors.hoTen && (
                                <p className="mt-1 text-sm text-red-400">{errors.hoTen}</p>
                            )}
                        </div>

                        {/* Email - moved above password */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Nhập email"
                            />
                            {emailChecking && (
                                <p className="mt-1 text-xs text-gray-300">Đang kiểm tra email...</p>
                            )}
                            {!errors.email && emailTaken && (
                                <p className="mt-1 text-sm text-red-400">Email đã có người sử dụng</p>
                            )}
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="matKhau" className="block text-sm font-medium text-gray-300 mb-2">
                                Mật khẩu
                            </label>
                            <input
                                id="matKhau"
                                name="matKhau"
                                type="password"
                                required
                                value={formData.matKhau}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 ${errors.matKhau ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Nhập mật khẩu"
                            />
                            {errors.matKhau && (
                                <p className="mt-1 text-sm text-red-400">{errors.matKhau}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="xacNhanMatKhau" className="block text-sm font-medium text-gray-300 mb-2">
                                Nhập lại mật khẩu
                            </label>
                            <input
                                id="xacNhanMatKhau"
                                name="xacNhanMatKhau"
                                type="password"
                                required
                                value={formData.xacNhanMatKhau}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 ${errors.xacNhanMatKhau ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Nhập lại mật khẩu"
                            />
                            {errors.xacNhanMatKhau && (
                                <p className="mt-1 text-sm text-red-400">{errors.xacNhanMatKhau}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="soDT" className="block text-sm font-medium text-gray-300 mb-2">
                                Số điện thoại
                            </label>
                            <input
                                id="soDT"
                                name="soDT"
                                type="tel"
                                required
                                value={formData.soDT}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 ${errors.soDT ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Nhập số điện thoại (10 số)"
                            />
                            {errors.soDT && (
                                <p className="mt-1 text-sm text-red-400">{errors.soDT}</p>
                            )}
                        </div>

                        {/* Removed group code field */}

                        {/* Error Messages */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                                <p className="text-red-400 text-sm font-semibold mb-2">
                                    Lỗi đăng ký:
                                </p>
                                <p className="text-red-400 text-sm">
                                    {error}
                                </p>
                                {error.includes('Email đã tồn tại') && (
                                    <p className="text-yellow-400 text-xs mt-2">
                                        💡 Gợi ý: Hãy thử email khác hoặc đăng nhập nếu đã có tài khoản
                                    </p>
                                )}
                                {error.includes('Tài khoản đã tồn tại') && (
                                    <p className="text-yellow-400 text-xs mt-2">
                                        💡 Gợi ý: Hãy thử tên tài khoản khác
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Success Messages */}
                        {success && (
                            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                                <p className="text-green-400 text-sm">
                                    Đăng ký thành công! Đang chuyển đến trang đăng nhập...
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 py-3 px-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                                    Đang đăng ký...
                                </div>
                            ) : (
                                'Đăng Ký'
                            )}
                        </button>
                    </form>

                    {/* Link to Login */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-300">
                            Đã có tài khoản?
                            <button
                                type="button"
                                onClick={() => {
                                    navigate('/dangnhap');
                                }}
                                className="ml-2 text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-200"
                            >
                                Đăng nhập
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
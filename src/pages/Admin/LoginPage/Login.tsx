import { useState, useEffect} from "react";
import type {FormEvent, ChangeEvent}from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, clearError } from "./slice";
import type { AppDispatch} from "../../store";

interface FormData {
  email: string;
  password: string;
}

function LoginAdmin() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // const { allowNavigation } = useNavigation();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state: any) => state.loginAdm
  );

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "ADMIN") {
        navigate("/admin/rooms");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-700 to-pink-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-2">Đăng Nhập</h2>
          <p className="text-gray-300">Chào mừng bạn trở lại!</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Tài khoản
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 border-gray-600"
                placeholder="Nhập tài khoản"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 border-gray-600"
                placeholder="Nhập mật khẩu"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 py-3 px-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                "Đăng Nhập"
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default LoginAdmin;
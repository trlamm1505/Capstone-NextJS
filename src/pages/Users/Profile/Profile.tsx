import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { fetchProfile, updateProfile } from "./slice";
import { setAuthenticated } from "../LoginPage/slice";
import api from "../../../services/api";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector(
    (s: RootState) =>
      (s as any).profile || { profile: null, loading: false, error: null }
  );
  const authUser = useSelector((s: RootState) => (s as any).login?.user);
  const loginState = useSelector((s: RootState) => (s as any).login);
  const userId =
    (authUser as any)?.id ??
    (authUser as any)?.userId ??
    (authUser as any)?.maNguoiDung;

  type Booking = {
    id: number;
    maPhong: number;
    ngayDen: string;
    ngayDi: string;
    soLuongKhach: number;
    maNguoiDung: number;
  };
  type Room = {
    id: number;
    tenPhong: string;
    hinhAnh: string;
    giaTien?: number;
    khach?: number;
    phongNgu?: number;
    giuong?: number;
    phongTam?: number;
    moTa?: string;
  };
  const [bookings, setBookings] = useState<Array<Booking & { room?: Room }>>(
    []
  );
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
  const [showAllBookings, setShowAllBookings] = useState<boolean>(false);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const [rightMaxHeight, setRightMaxHeight] = useState<number | undefined>(
    undefined
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [form, setForm] = useState<{
    email?: string;
    phone?: string;
    birthday?: string;
    gender?: boolean;
    avatar?: string;
  }>({});
  const [birthY, setBirthY] = useState<string>("");
  const [birthM, setBirthM] = useState<string>("");
  const [birthD, setBirthD] = useState<string>("");

  useEffect(() => {
    console.log("Profile component mounted");
    console.log("authUser:", authUser);
    console.log("localStorage auth_user:", localStorage.getItem("auth_user"));
    console.log("Redux profile state:", { profile, loading, error });
    console.log("Redux login state:", loginState);

    // Only fetch profile once when component mounts and user is authenticated
    if (!profile && !loading && (authUser || loginState?.isAuthenticated)) {
      console.log("Dispatching fetchProfile...");
      dispatch(fetchProfile());
    }
  }, [dispatch, profile, loading, authUser, loginState]);

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      setLoadingBookings(true);
      try {
        const res = await api.get(`/dat-phong/lay-theo-nguoi-dung/${userId}`);
        const mine = (res?.data?.content ?? []) as Booking[];
        console.log('Raw bookings from API:', mine);

        // Tạo Map để lưu booking mới nhất cho mỗi phòng
        const roomBookingMap = new Map<number, Booking>();

        let processedBookings: Booking[];

        if (showAllBookings) {
          // Hiển thị tất cả bookings, sắp xếp theo ngày mới nhất
          processedBookings = [...mine].sort((a, b) => new Date(b.ngayDen).getTime() - new Date(a.ngayDen).getTime());
        } else {
          // Chỉ hiển thị booking mới nhất cho mỗi phòng
          mine.forEach((booking) => {
            const roomId = booking.maPhong;
            const existingBooking = roomBookingMap.get(roomId);

            if (!existingBooking || new Date(booking.ngayDen) > new Date(existingBooking.ngayDen)) {
              roomBookingMap.set(roomId, booking);
            }
          });

          processedBookings = Array.from(roomBookingMap.values())
            .sort((a, b) => new Date(b.ngayDen).getTime() - new Date(a.ngayDen).getTime());
        }

        console.log('Processed bookings:', processedBookings);

        // Lấy danh sách room IDs từ processed bookings
        const roomIds = Array.from(new Set(processedBookings.map(b => b.maPhong)));
        const roomMap: Record<number, Room> = {};

        await Promise.all(
          roomIds.map(async (rid) => {
            try {
              const r = await api.get(`/phong-thue/${rid}`);
              const content = (r?.data?.content ?? r?.data) as Room;
              if (content?.id) roomMap[content.id] = content;
            } catch (err) {
              console.error(`Error loading room ${rid}:`, err);
            }
          })
        );

        setBookings(processedBookings.map((b) => ({ ...b, room: roomMap[b.maPhong] })));
      } catch (err) {
        console.error('Error loading bookings:', err);
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };
    load();
  }, [userId, showAllBookings]);

  // Sync right panel max height with left panel height on desktop
  useEffect(() => {
    const updateHeights = () => {
      if (!leftRef.current) return;
      const rect = leftRef.current.getBoundingClientRect();
      setRightMaxHeight(rect.height);
    };
    updateHeights();
    window.addEventListener("resize", updateHeights);
    return () => window.removeEventListener("resize", updateHeights);
  }, [profile, authUser]);

  const formatBirthday = (s?: string) => {
    if (!s || typeof s !== "string") return "";
    // Handle ISO date format like "2004-05-15"
    if (s.includes("-") && s.length >= 10) {
      const parts = s.slice(0, 10).split("-");
      if (parts.length === 3) {
        const [y, m, d] = parts;
        return `${d}/${m}/${y}`;
      }
    }
    // Handle other date formats
    const d = new Date(s);
    if (isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear());
    return `${dd}/${mm}/${yy}`;
  };

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 lg:px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Hồ sơ cá nhân</h1>

      {loading && <div>Đang tải...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {(profile || authUser) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Personal info */}
          <div
            ref={leftRef}
            className="rounded-2xl border p-6 lg:col-span-1 lg:sticky lg:top-24 h-max"
          >
            {(() => {
              const placeholder =
                "data:image/svg+xml;utf8,<?xml version='1.0' encoding='UTF-8'?><svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><rect width='100%' height='100%' fill='%23f1f5f9'/><circle cx='30' cy='22' r='10' fill='%23cbd5e1'/><rect x='15' y='38' width='30' height='8' rx='4' fill='%23cbd5e1'/></svg>";
              const avatarUrl =
                profile?.avatar || authUser?.avatar || placeholder;
              return (
                <div className="mb-4">
                  <label
                    className="block w-fit cursor-pointer"
                    title="Cập nhật ảnh"
                  >
                    <img
                      src={avatarUrl}
                      alt={
                        profile?.name ||
                        authUser?.name ||
                        authUser?.hoTen ||
                        "User"
                      }
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        // Validate file size (max 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          alert("Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB.");
                          return;
                        }

                        // Validate file type
                        if (!file.type.startsWith('image/')) {
                          alert("Vui lòng chọn file hình ảnh.");
                          return;
                        }

                        try {
                          const fd = new FormData();
                          fd.append("formFile", file);
                          const token =
                            (authUser as any)?.token ||
                            (authUser as any)?.accessToken ||
                            (typeof window !== "undefined"
                              ? localStorage.getItem("accessToken")
                              : "") ||
                            "";
                          await api.post("/users/upload-avatar", fd, {
                            headers: {
                              // Let the browser set proper multipart boundary
                              token,
                            },
                          });
                          // Reload latest profile
                          dispatch(fetchProfile() as any);
                          // Update login.user and localStorage immediately for header
                          try {
                            const me = await api.get(`/users/${userId}`);
                            const u = (me?.data?.content ?? me?.data) as any;
                            const updated = {
                              ...(authUser as any),
                              avatar:
                                u?.avatar ??
                                u?.avatarUrl ??
                                (authUser as any)?.avatar,
                            };
                            dispatch(setAuthenticated(updated) as any);
                            try {
                              localStorage.setItem(
                                "auth_user",
                                JSON.stringify(updated)
                              );
                            } catch (err) {
                              console.error('Error saving to localStorage:', err);
                            }
                          } catch (err) {
                            console.error('Error updating user info:', err);
                          }
                        } catch (err) {
                          console.error('Error uploading avatar:', err);
                          alert("Lỗi khi tải lên ảnh đại diện. Vui lòng thử lại.");
                        }
                      }}
                    />
                  </label>
                  <div className="mt-3 text-3xl font-semibold">
                    {profile?.name ||
                      authUser?.name ||
                      authUser?.hoTen ||
                      "Người dùng"}
                  </div>
                </div>
              );
            })()}
            <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
              <div>
                <div className="text-gray-500 text-base">Email</div>
                {isEditing ? (
                  <input
                    type="email"
                    value={
                      form.email ?? profile?.email ?? authUser?.email ?? ""
                    }
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full rounded-lg border px-3 py-2 text-lg"
                  />
                ) : (
                  <div className="font-medium text-lg">
                    {profile?.email || authUser?.email || ""}
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-500 text-base">Số điện thoại</div>
                {isEditing ? (
                  <input
                    value={
                      form.phone ?? profile?.phone ?? authUser?.phone ?? ""
                    }
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="w-full rounded-lg border px-3 py-2 text-lg"
                  />
                ) : (
                  <div className="font-medium text-lg">
                    {profile?.phone || authUser?.phone || authUser?.soDT || ""}
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-500 text-base">Ngày sinh</div>
                {isEditing ? (
                  <div className="flex gap-2">
                    {(() => {
                      const currentYear = new Date().getFullYear();
                      const years: number[] = [];
                      for (let y = currentYear; y >= 1950; y--) years.push(y);
                      const months = Array.from(
                        { length: 12 },
                        (_, i) => i + 1
                      );
                      const yearNum = parseInt(birthY || "0", 10);
                      const monthNum = parseInt(birthM || "0", 10);
                      const daysInMonth =
                        monthNum && yearNum
                          ? new Date(yearNum, monthNum, 0).getDate()
                          : 31;
                      const days = Array.from(
                        { length: daysInMonth },
                        (_, i) => i + 1
                      );
                      return (
                        <>
                          <select
                            value={birthD}
                            onChange={(e) => setBirthD(e.target.value)}
                            className="rounded-lg border px-2 py-2 text-lg"
                          >
                            <option value="">Ngày</option>
                            {days.map((d) => (
                              <option key={d} value={String(d)}>
                                {d}
                              </option>
                            ))}
                          </select>
                          <select
                            value={birthM}
                            onChange={(e) => setBirthM(e.target.value)}
                            className="rounded-lg border px-2 py-2 text-lg"
                          >
                            <option value="">Tháng</option>
                            {months.map((m) => (
                              <option key={m} value={String(m)}>
                                {m}
                              </option>
                            ))}
                          </select>
                          <select
                            value={birthY}
                            onChange={(e) => setBirthY(e.target.value)}
                            className="rounded-lg border px-2 py-2 text-lg"
                          >
                            <option value="">Năm</option>
                            {years.map((y) => (
                              <option key={y} value={String(y)}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="font-medium text-lg">
                    {formatBirthday(profile?.birthday)}
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-500 text-base">Giới tính</div>
                {isEditing ? (
                  <select
                    value={String(form.gender ?? profile?.gender ?? "")}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        gender: e.target.value === "true",
                      }))
                    }
                    className="w-full rounded-lg border px-3 py-2 text-lg"
                  >
                    <option value="">--</option>
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                ) : (
                  <div className="font-medium text-lg">
                    {profile?.gender === true
                      ? "Nam"
                      : profile?.gender === false
                        ? "Nữ"
                        : ""}
                  </div>
                )}
              </div>
              {/* Removed Avatar URL section as requested */}
              <div className="pt-2">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg bg-rose-500 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isUpdating}
                      onClick={async () => {
                        if (!userId) return;
                        // Email duplicate check if changed
                        const newEmail = (form.email ?? "").trim();
                        if (newEmail) {
                          try {
                            const res = await api.get("/users");
                            const list = (res?.data?.content ??
                              res?.data ??
                              []) as any[];
                            const exists = list.some(
                              (u) =>
                                (u.email || u?.user?.email) === newEmail &&
                                Number(u?.id) !== Number(userId)
                            );
                            if (exists) {
                              alert(
                                "Email đã được sử dụng. Vui lòng chọn email khác."
                              );
                              return;
                            }
                          } catch (err) {
                            console.error('Error checking email:', err);
                            alert("Không thể kiểm tra email. Vui lòng thử lại.");
                            return;
                          }
                        }
                        const pad = (n: string | number) =>
                          String(n).padStart(2, "0");
                        const composedBirthday =
                          birthY && birthM && birthD
                            ? `${birthY}-${pad(birthM)}-${pad(birthD)}`
                            : form.birthday;
                        setIsUpdating(true);
                        try {
                          await dispatch(
                            updateProfile({
                              id: Number(userId),
                              email: form.email,
                              phone: form.phone,
                              birthday: composedBirthday,
                              gender: form.gender,
                            }) as any
                          );
                          setIsEditing(false);
                          alert("Cập nhật hồ sơ thành công!");
                        } catch (err) {
                          console.error('Error updating profile:', err);
                          alert("Lỗi khi cập nhật hồ sơ. Vui lòng thử lại.");
                        } finally {
                          setIsUpdating(false);
                        }
                      }}
                    >
                      {isUpdating ? "Đang lưu..." : "Lưu"}
                    </button>
                    <button
                      className="rounded-lg border px-4 py-2"
                      onClick={() => {
                        setIsEditing(false);
                        setForm({});
                      }}
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <button
                    className="rounded-lg border px-4 py-2"
                    onClick={() => {
                      setForm({
                        email: profile?.email,
                        phone: profile?.phone,
                        birthday: profile?.birthday,
                        gender: profile?.gender,
                      });
                      const b = (
                        profile?.birthday ||
                        authUser?.birthday ||
                        ""
                      ).slice(0, 10);
                      const [y, m, d] = b ? b.split("-") : ["", "", ""];
                      // Normalize to match select option values (no leading zeros)
                      setBirthY(y || "");
                      setBirthM(m ? String(parseInt(m, 10)) : "");
                      setBirthD(d ? String(parseInt(d, 10)) : "");
                      setIsEditing(true);
                    }}
                  >
                    Chỉnh sửa hồ sơ
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Right: Booked rooms */}
          <div
            className="rounded-2xl border p-4 lg:col-span-2 no-scrollbar"
            style={{
              maxHeight: rightMaxHeight ? `${rightMaxHeight}px` : undefined,
              overflowY: rightMaxHeight ? ("auto" as const) : undefined,
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">
                Phòng đã thuê ({bookings.length})
              </h2>
              {bookings.length > 0 && (
                <button
                  onClick={() => setShowAllBookings(!showAllBookings)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {showAllBookings ? 'Chỉ hiển thị phòng duy nhất' : 'Hiển thị tất cả lịch sử'}
                </button>
              )}
            </div>
            {loadingBookings && <div>Đang tải...</div>}
            {!loadingBookings && bookings.length === 0 && (
              <div className="text-gray-500">Chưa có đặt phòng nào.</div>
            )}
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="flex gap-3 border rounded-xl p-3">
                  <img
                    src={
                      b.room?.hinhAnh ||
                      "https://via.placeholder.com/160x120?text=Room"
                    }
                    alt={b.room?.tenPhong || `Phòng #${b.maPhong}`}
                    className="h-24 w-32 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">
                      {b.room?.tenPhong || `Phòng #${b.maPhong}`}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(b.ngayDen).toLocaleDateString()} -{" "}
                      {new Date(b.ngayDi).toLocaleDateString()} ·{" "}
                      {b.soLuongKhach} khách
                    </div>
                    {b.room && (
                      <div className="text-sm text-gray-700">
                        {b.room.khach || 0} khách · {b.room.phongNgu || 0} phòng
                        ngủ · {b.room.giuong || 0} giường ·{" "}
                        {b.room.phongTam || 0} phòng tắm
                      </div>
                    )}
                  </div>
                  {b.room?.giaTien ? (
                    <div className="text-right whitespace-nowrap">
                      <div className="text-base font-semibold">
                        ${b.room.giaTien}
                      </div>
                      <div className="text-xs text-gray-500">/ đêm</div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

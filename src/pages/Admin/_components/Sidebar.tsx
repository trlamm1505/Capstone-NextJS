
import { NavLink} from "react-router-dom";


const menu = [
  { label: "Quản lý người dùng", to: "/admin/users" },
  {
    label: "Quản lý phòng nghỉ",
    to: "/admin/rooms",
    submenu: [
      { label: "Danh sách phòng cho thuê", to: "/admin/rooms" }, //Phong - phong-thue
      { label: "Đặt phòng", to: "/admin/book-room" },//dat-phong
    ],
  },
  { label: "Vị trí", to: "/admin/locations" },//dat-phong
];

export default function Sidebar() {
  return (
    <div className="w-60 bg-slate-900 text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-8">🏠 Admins Airbnb</h1>
      <nav className="flex flex-col space-y-3">
        {menu.map((item) => (
          <div key={item.to}>
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `pl-2 py-2 rounded hover:bg-slate-700 ${isActive ? "bg-slate-800" : ""
                }`
              }
            >
              {item.label}
            </NavLink>

            {item.submenu && (
              <div className="ml-6 mt-1 flex flex-col space-y-1">
                {item.submenu.map((sub) => (
                  <NavLink
                    key={sub.to}
                    to={sub.to}
                    className={({ isActive }) =>
                      `block pl-2 py-1 rounded hover:bg-slate-700 text-sm ${isActive ? "bg-slate-800" : ""
                      }`
                    }
                  >
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

import { useState } from "react";
import { Webhook, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../store";
import { logout } from "../../LoginPage/slice";
import { useLocation } from "react-router-dom";

type NavItem = {
    label: string;
    href: string;
};

type HeaderProps = {
    navItems?: NavItem[];
    logoSrc?: string;
    logoAlt?: string;
};

export default function Header({
    navItems = [
        { label: "Nơi ở", href: "#" },
        { label: "Trải nghiệm", href: "#" },
        { label: "Trải nghiệm trực tuyến", href: "#" },
    ],
    logoSrc,
    logoAlt = "Logo",
}: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, user } = useSelector((state: any) => state.login || { isAuthenticated: false, user: null });
    const location = useLocation();
    // Dark header on homepage, light header elsewhere
    const isHome = location.pathname === "/";
    const isLight = !isHome;
    const redirectQuery = `?redirect=${encodeURIComponent(location.pathname + location.search)}`;

    return (
        <header className={`w-full ${isLight ? "bg-white text-black border-b border-black/10" : "bg-black text-white"}`}>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-12 sm:px-10 lg:px-12">
                {/* Left: Logo */}
                <a href="/" className="flex items-center gap-3" aria-label="Homepage">
                    {logoSrc ? (
                        <img src={logoSrc} alt={logoAlt} className="h-16 w-auto" />
                    ) : (
                        <Webhook className="h-12 w-12 text-rose-500" />
                    )}
                    <span className="hidden text-4xl font-bold tracking-wide sm:inline">airbnb</span>
                </a>

                {/* Center: Nav (hidden on small) */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`text-lg font-semibold transition ${isLight ? "text-gray-800 hover:text-black" : "text-gray-200 hover:text-white"}`}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Right: Auth actions */}
                <div className="hidden items-center gap-4 sm:flex relative">
                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setUserMenuOpen((v) => !v)}
                                className={`flex items-center gap-3 rounded-2xl border px-5 py-3 text-lg ${isLight ? "border-black/20 hover:bg-black/5" : "border-white/20 hover:bg-white/10"}`}
                            >
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user?.name || "avatar"} className="h-8 w-8 rounded-full object-cover" />
                                ) : (
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20"><User className="h-5 w-5" /></span>
                                )}
                                <span className="font-semibold">{user?.name || "Tài khoản"}</span>
                            </button>
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-white/10 bg-black/95 p-2 shadow-2xl z-50">
                                    <div className="px-3 py-2">
                                        <div className="text-sm font-semibold text-white">{user?.name}</div>
                                        <div className="text-xs text-gray-300 truncate">{user?.email}</div>
                                    </div>
                                    <a href="/profile" className="block rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-white/10">Profile</a>
                                    <button
                                        type="button"
                                        onClick={() => { setUserMenuOpen(false); dispatch(logout()); }}
                                        className="block w-full text-left rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-white/10"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <a href={`/dangnhap${redirectQuery}`} className={`rounded-full border px-6 py-3 text-base font-semibold ${isLight ? "border-black/20 hover:bg-black/5" : "border-white/20 hover:bg-white/10"}`}>Đăng nhập</a>
                            <a href={`/dangky${redirectQuery}`} className="rounded-full bg-rose-500 px-6 py-3 text-base font-semibold text-white hover:bg-rose-600">Đăng ký</a>
                        </>
                    )}
                </div>

                {/* Mobile menu button (center nav collapsed) */}
                <button
                    type="button"
                    className={`ml-3 inline-flex items-center rounded-md border px-4 py-3 text-base md:hidden ${isLight ? "border-black/20 text-black" : "border-white/20"}`}
                    onClick={() => setIsOpen((v) => !v)}
                    aria-label="Toggle menu"
                    aria-expanded={isOpen}
                >
                    Menu
                </button>
            </div>

            {/* Mobile nav */}
            <div className={`md:hidden ${isOpen ? "block" : "hidden"} absolute right-6 top-20 w-64 rounded-xl border ${isLight ? "border-black/10 bg-white" : "border-white/10 bg-black/95"} shadow-2xl z-50`}>
                <nav className="flex flex-col gap-1 p-4 ${isLight ? 'text-black' : 'text-white'}`">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`rounded-lg px-3 py-2 text-sm ${isLight ? "text-gray-800 hover:bg-black/5" : "text-gray-200 hover:bg-white/10 hover:text-white"}`}
                        >
                            {item.label}
                        </a>
                    ))}
                    <div className="mt-3 border-t border-white/10 pt-3">
                        {isAuthenticated ? (
                            <>
                                <div className="px-2 pb-2">
                                    <div className={`text-sm font-semibold ${isLight ? 'text-black' : 'text-white'}`}>{user?.name}</div>
                                    <div className={`text-xs truncate ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>{user?.email}</div>
                                </div>
                                <a href="/profile" className={`rounded-lg px-3 py-2 text-sm ${isLight ? 'text-gray-800 hover:bg-black/5' : 'text-gray-200 hover:bg-white/10'}`}>Profile</a>
                                <button
                                    type="button"
                                    onClick={() => dispatch(logout())}
                                    className={`mt-2 w-full rounded-lg px-3 py-2 text-left text-sm ${isLight ? 'text-gray-800 hover:bg-black/5' : 'text-gray-200 hover:bg-white/10'}`}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <a href={`/dangnhap${redirectQuery}`} className={`rounded-lg border px-4 py-2 text-sm font-medium text-center ${isLight ? 'border-black/20 text-black hover:bg-black/5' : 'border-white/20 text-white hover:bg-white/10'}`}>Đăng nhập</a>
                                <a href={`/dangky${redirectQuery}`} className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 text-center">Đăng ký</a>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}



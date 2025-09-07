import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, MapPin, Calendar, Users, X } from "lucide-react";
import type { AppDispatch, RootState } from "../store";
import { useNavigate } from "react-router-dom";
import {
    setSearchQuery,
    searchLocations,
    selectLocation,
    clearSuggestions,
    setShowSuggestions
} from "./slice";
import { fetchLocations, fetchFeaturedLocations } from "./slice";

type SearchFormData = {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    locationId?: number;
};

export default function HomePage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {
        searchQuery,
        suggestions,
        showSuggestions,
        loading,
        error,
        featured,
    } = useSelector((state: RootState) => state.location);

    const [searchData, setSearchData] = useState<SearchFormData>({
        location: "",
        checkIn: "",
        checkOut: "",
        guests: "",
    });
    const [suppressSearch, setSuppressSearch] = useState(false);
    const locationInputRef = useRef<HTMLInputElement | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(typeof window !== "undefined" ? window.innerWidth < 640 : false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Debounced search effect
    useEffect(() => {
        if (suppressSearch) {
            // Skip one cycle after a programmatic selection
            setSuppressSearch(false);
            return;
        }
        const timer = setTimeout(() => {
            if (searchQuery.length > 0) {
                dispatch(searchLocations(searchQuery));
            } else {
                dispatch(clearSuggestions());
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, dispatch]);

    useEffect(() => {
        // load featured destinations on mount
        dispatch(fetchFeaturedLocations());
    }, [dispatch]);

    const handleLocationChange = (value: string) => {
        dispatch(setSearchQuery(value));
        setSearchData(prev => ({ ...prev, location: value }));
        if (value.trim().length > 0) {
            dispatch(setShowSuggestions(true));
        } else {
            dispatch(clearSuggestions());
        }
    };

    const handleLocationSelect = (location: any) => {
        setSuppressSearch(true);
        dispatch(selectLocation(location));
        dispatch(clearSuggestions());
        dispatch(setShowSuggestions(false));
        const fullLabel = `${location.tenViTri}, ${location.tinhThanh}, ${location.quocGia}`;
        setSearchData(prev => ({ ...prev, location: fullLabel, locationId: location.id }));
        // keep searchQuery consistent with displayed text
        dispatch(setSearchQuery(fullLabel));
        // Blur to close any remaining dropdown state
        locationInputRef.current?.blur();
    };

    const clearLocation = () => {
        dispatch(setSearchQuery(""));
        setSearchData(prev => ({ ...prev, location: "" }));
    };

    const closeSuggestions = () => {
        dispatch(setShowSuggestions(false));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchData.locationId) params.set("maViTri", String(searchData.locationId));
        else if (searchData.location) params.set("city", searchData.location);
        if (searchData.checkIn) params.set("checkIn", searchData.checkIn);
        if (searchData.checkOut) params.set("checkOut", searchData.checkOut);
        navigate(`/listings?${params.toString()}`);
    };

    // Static data for 'Ở bất cứ đâu'
    const anywhereItems = [
        {
            id: 1,
            title: "Toàn bộ nhà",
            image: "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=900&q=60",
        },
        {
            id: 2,
            title: "Chỗ ở độc đáo",
            image: "https://amdmodular.com/wp-content/uploads/2022/06/Frame-190-1024x673.jpg",
        },
        {
            id: 3,
            title: "Trang trại và thiên nhiên",
            image: "https://cms.luatvietnam.vn/uploaded/Images/Original/2018/12/14/trang-trai_1412152008.jpg",
        },
        {
            id: 4,
            title: "Cho phép mang thú cưng",
            image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=60",
        },
    ];

    return (
        <>
            {/* Search bar positioned at boundary between header and hero */}
            <div className="absolute left-1/2 top-50 z-20 w-[92%] max-w-[1100px] -translate-x-1/2 translate-y-0 px-4 sm:top-32 sm:w-4/5">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={handleSearch} className="mx-auto w-full">
                        <div className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row sm:gap-1 sm:rounded-full sm:p-1.5">

                            {/* Location */}
                            <div className="flex-1 sm:flex-[1.6] sm:min-w-[250px]">
                                <label className="mb-0.5 block text-sm font-semibold text-gray-800">Địa điểm</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        ref={locationInputRef}
                                        type="text"
                                        placeholder="Bạn sắp đi đâu?"
                                        value={searchData.location}
                                        onChange={(e) => handleLocationChange(e.target.value)}
                                        onFocus={() => {
                                            dispatch(fetchLocations());
                                        }}
                                        className="w-full rounded-md border-0 bg-gray-50 px-9 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-rose-500 sm:py-1.5"
                                    />
                                    {searchData.location && (
                                        <button
                                            type="button"
                                            onClick={clearLocation}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                    {showSuggestions && (
                                        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-auto rounded-xl bg-white shadow-2xl ring-1 ring-black/5 sm:max-h-80">
                                            {loading ? (
                                                <div className="flex items-center justify-center py-6">
                                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
                                                </div>
                                            ) : suggestions && suggestions.length > 0 ? (
                                                <ul className="divide-y divide-gray-100">
                                                    {suggestions.map((loc: any) => (
                                                        <li key={loc.id}>
                                                            <button
                                                                type="button"
                                                                onMouseDown={() => handleLocationSelect(loc)}
                                                                className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-gray-50"
                                                            >
                                                                <img
                                                                    src={loc.hinhAnh}
                                                                    alt={loc.tenViTri}
                                                                    className="h-10 w-14 flex-none rounded-md object-cover"
                                                                    onError={(e) => {
                                                                        (e.currentTarget as HTMLImageElement).src =
                                                                            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=60";
                                                                    }}
                                                                />
                                                                <div className="min-w-0">
                                                                    <div className="truncate text-sm font-semibold text-gray-900">{loc.tenViTri}</div>
                                                                    <div className="truncate text-xs text-gray-600">{loc.tinhThanh}, {loc.quocGia}</div>
                                                                </div>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="py-6 text-center text-sm text-gray-500">Không tìm thấy địa điểm phù hợp</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Check-in */}
                            <div className="flex-1 min-w-0">
                                <label className="mb-0.5 block text-sm font-semibold text-gray-800">Nhận phòng</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        value={searchData.checkIn}
                                        onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                                        className="w-full rounded-md border-0 bg-gray-50 px-9 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-rose-500 sm:py-1.5"
                                    />
                                </div>
                            </div>

                            {/* Check-out */}
                            <div className="flex-1 min-w-0">
                                <label className="mb-0.5 block text-sm font-semibold text-gray-800">Trả phòng</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        value={searchData.checkOut}
                                        onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                                        className="w-full rounded-md border-0 bg-gray-50 px-9 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-rose-500 sm:py-1.5"
                                    />
                                </div>
                            </div>

                            {/* Guests */}
                            <div className="flex-1 min-w-0">
                                <label className="mb-0.5 block text-sm font-semibold text-gray-800">Khách</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Thêm khách"
                                        value={searchData.guests}
                                        onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                                        className="w-full rounded-md border-0 bg-gray-50 px-9 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-rose-500 sm:py-1.5"
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="flex items-end justify-center sm:justify-start">
                                <button
                                    type="submit"
                                    aria-label="Tìm kiếm"
                                    disabled={loading}
                                    className="flex h-12 w-full items-center justify-center rounded-full bg-rose-500 text-white transition-colors hover:bg-rose-600 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 sm:h-10 sm:w-auto sm:px-4"
                                >
                                    {loading ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : (
                                        <Search className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>


            {/* Hero area with black background and inset image */}
            <div className="w-full bg-black pt-4 pb-12">
                <div className="relative mx-4 h-[80vh] overflow-hidden rounded-2xl md:mx-6 lg:mx-8">
                    <img
                        src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2560&q=80"
                        alt="Forest cabins"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
            </div>

            {/* Featured destinations - below hero image */}
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <h2 className="mb-6 text-2xl font-semibold text-gray-900">Khám phá những điểm đến gần đây</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {featured.map((loc: any) => (
                        <div key={loc.id} className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow">
                            <img
                                src={loc.hinhAnh}
                                alt={loc.tenViTri}
                                className="h-16 w-20 flex-none rounded-lg object-cover"
                            />
                            <div className="min-w-0">
                                <div className="truncate text-base font-semibold text-gray-900">{loc.tenViTri}</div>
                                <div className="truncate text-sm text-gray-600">{loc.tinhThanh}, {loc.quocGia}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Anywhere section */}
            <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
                <h2 className="mb-6 text-2xl font-semibold text-gray-900">Ở bất cứ đâu</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                    {anywhereItems.map((item) => (
                        <div key={item.id} className="overflow-hidden rounded-2xl bg-white shadow">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-64 w-full object-cover"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60";
                                }}
                            />
                            <div className="px-5 py-4">
                                <div className="text-base font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

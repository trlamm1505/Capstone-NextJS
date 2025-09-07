

type FooterSection = {
    title: string;
    links: { label: string; href: string }[];
};

type FooterProps = {
    sections?: FooterSection[];
    year?: number;
};

const defaultSections: FooterSection[] = [
    {
        title: "GIỚI THIỆU",
        links: [
            { label: "Phương thức hoạt động của Airbnb", href: "#" },
            { label: "Trang tin tức", href: "#" },
            { label: "Nhà đầu tư", href: "#" },
            { label: "Airbnb Plus", href: "#" },
            { label: "Airbnb Luxe", href: "#" },
            { label: "HotelTonight", href: "#" },
            { label: "Airbnb for Work", href: "#" },
            { label: "Nhờ có Host, mọi điều đều có thể", href: "#" },
            { label: "Cơ hội nghề nghiệp", href: "#" },
            { label: "Thư của nhà sáng lập", href: "#" },
        ],
    },
    {
        title: "CỘNG ĐỒNG",
        links: [
            { label: "Sự đa dạng và Cảm giác thân thuộc", href: "#" },
            { label: "Tiện nghi phù hợp cho người khuyết tật", href: "#" },
            { label: "Đối tác liên kết Airbnb", href: "#" },
            { label: "Chỗ ở cho tuyến đầu", href: "#" },
            { label: "Lượt giới thiệu của khách", href: "#" },
            { label: "Airbnb.org", href: "#" },
        ],
    },
    {
        title: "ĐÓN TIẾP KHÁCH",
        links: [
            { label: "Cho thuê nhà", href: "#" },
            { label: "Tổ chức Trải nghiệm trực tuyến", href: "#" },
            { label: "Tổ chức trải nghiệm", href: "#" },
            { label: "Đón tiếp khách có trách nhiệm", href: "#" },
            { label: "Trung tâm tài nguyên", href: "#" },
            { label: "Trung tâm cộng đồng", href: "#" },
        ],
    },
    {
        title: "HỖ TRỢ",
        links: [
            { label: "Biện pháp ứng phó với đại dịch COVID-19 của chúng tôi", href: "#" },
            { label: "Trung tâm trợ giúp", href: "#" },
            { label: "Các tùy chọn hủy", href: "#" },
            { label: "Hỗ trợ khu dân cư", href: "#" },
            { label: "Tin cậy và an toàn", href: "#" },
        ],
    },
];

export default function Footer({ sections = defaultSections, year = new Date().getFullYear() }: FooterProps) {
    return (
        <footer className="w-full bg-zinc-100 text-zinc-800">
            {/* Top grid */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:grid-cols-2 md:grid-cols-4 sm:px-6 lg:px-8">
                {sections.map((section) => (
                    <div key={section.title}>
                        <h3 className="mb-3 text-xs font-semibold tracking-widest text-zinc-900">{section.title}</h3>
                        <ul className="space-y-2">
                            {section.links.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-zinc-600 hover:underline hover:decoration-zinc-400"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="h-px w-full bg-zinc-200" />

            {/* Bottom bar */}
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 text-sm sm:flex-row sm:px-6 lg:px-8">
                <p className="text-center text-zinc-600 sm:text-left">
                    © {year} Airbnb, Inc. All rights reserved · <a href="#" className="hover:underline">Quyền riêng tư</a> · <a href="#" className="hover:underline">Điều khoản</a> · <a href="#" className="hover:underline">Sơ đồ trang web</a>
                </p>
                <div className="flex items-center gap-4">
                    <button type="button" className="inline-flex items-center gap-1 hover:underline">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                            <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                            <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
                        </svg>
                        Tiếng Việt (VN)
                    </button>
                    <span className="select-none">$</span>
                    <button type="button" className="hover:underline">USD</button>
                    <div className="ml-2 flex items-center gap-3">
                        {[
                            (
                                <svg key="fb" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                                    <path d="M22 12a10 10 0 10-11.5 9.87v-6.98H7.08V12h3.42V9.8c0-3.37 2-5.24 5.06-5.24 1.47 0 3 .26 3 .26v3.3h-1.69c-1.67 0-2.19 1.04-2.19 2.11V12h3.73l-.6 2.89h-3.13v6.98A10 10 0 0022 12z" />
                                </svg>
                            ),
                            (
                                <svg key="tw" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.29 4.29 0 001.88-2.37 8.58 8.58 0 01-2.72 1.04 4.28 4.28 0 00-7.29 3.9A12.15 12.15 0 013 5.16a4.28 4.28 0 001.33 5.71 4.24 4.24 0 01-1.94-.54v.05a4.28 4.28 0 003.44 4.19 4.28 4.28 0 01-1.93.07 4.28 4.28 0 003.99 2.97A8.59 8.59 0 012 19.54a12.12 12.12 0 006.56 1.92c7.88 0 12.19-6.53 12.19-12.19v-.56A8.7 8.7 0 0024 5.5a8.5 8.5 0 01-2.46.68h-.08z" />
                                </svg>
                            ),
                            (
                                <svg key="ig" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                                    <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm0 2h10c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3zm5 3.2A5.8 5.8 0 006.2 13 5.8 5.8 0 0012 18.8 5.8 5.8 0 0017.8 13 5.8 5.8 0 0012 7.2zm0 2A3.8 3.8 0 0115.8 13 3.8 3.8 0 0112 16.8 3.8 3.8 0 018.2 13 3.8 3.8 0 0112 9.2zm5.5-3.2a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6z" />
                                </svg>
                            ),
                        ].map((icon) => (
                            <span key={(icon as any).key} className="text-zinc-600 hover:text-zinc-900">
                                {icon}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}



import type { Metadata } from "next";
import { Playfair_Display, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

const notoSansKr = Noto_Sans_KR({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-noto-sans",
});

import { getSettings } from "@/lib/actions";
import Navigation from "@/components/Navigation";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    const siteUrl = (settings as any)?.siteUrl || "https://your-domain.com";
    const brandTitle = settings?.title || "ABLE K";

    return {
        title: `${brandTitle} | 프리미엄 인테리어 디자인 스튜디오`,
        description: settings?.headline || "상가, 아파트, 주택 등 공간의 가치를 더하는 프리미엄 인테리어 디자인 포트폴리오 에이블 케이(ABLE K)입니다.",
        keywords: ["인테리어", "에이블케이", brandTitle, "상가인테리어", "아파트인테리어", "고급인테리어", "디자인스튜디오"],
        authors: [{ name: brandTitle }],
        viewport: "width=device-width, initial-scale=1",
        icons: {
            icon: "/favicon.ico",
        },
        openGraph: {
            title: `${brandTitle} | 프리미엄 인테리어 디자인 스튜디오`,
            description: settings?.headline || "공간의 미학을 완성하는 에이블 케이의 포트폴리오를 확인하세요.",
            url: siteUrl,
            siteName: brandTitle,
            locale: "ko_KR",
            type: "website",
        },
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className={`${playfair.variable} ${notoSansKr.variable}`}>
            <body className="font-sans antialiased overflow-x-hidden">
                {/* Navigation */}
                <Navigation />
                {children}
            </body>
        </html>
    );
}

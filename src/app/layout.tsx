import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_KR, Noto_Serif_KR, Song_Myung } from "next/font/google";
import { SERVICE } from "@/lib/constants/service";
import "./globals.css";

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  preload: false,
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  preload: false,
});

const classicKr = Song_Myung({
  variable: "--font-classic-kr",
  weight: "400",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `숨겨진 도화력 분석 | ${SERVICE.name}`,
    template: `%s | ${SERVICE.name}`,
  },
  description: SERVICE.description,
  openGraph: {
    title: `숨겨진 도화력 분석 | ${SERVICE.name}`,
    description: SERVICE.description,
    siteName: SERVICE.name,
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07060e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${notoSerifKr.variable} ${notoSansKr.variable} ${classicKr.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

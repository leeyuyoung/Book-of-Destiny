import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, East_Sea_Dokdo, Noto_Sans_KR, Noto_Serif_KR, Song_Myung } from "next/font/google";
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

const brushKr = East_Sea_Dokdo({
  variable: "--font-brush-kr",
  weight: "400",
  subsets: ["latin"],
  preload: false,
});

const eerieKr = Song_Myung({
  variable: "--font-eerie-kr",
  weight: "400",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SERVICE.tagline} | ${SERVICE.name}`,
    template: `%s | ${SERVICE.name}`,
  },
  description: SERVICE.description,
};

export const viewport: Viewport = {
  themeColor: "#080404",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${notoSerifKr.variable} ${notoSansKr.variable} ${brushKr.variable} ${eerieKr.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

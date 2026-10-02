import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
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
  themeColor: "#05050a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${notoSerifKr.variable} ${notoSansKr.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import CheckFirstVisitProvider from "@/provider/check-first-visit-provider";
import MapProvider from "@/provider/map-provider";
import PageTransitionProvider from "@/provider/page-transition-provider";
import cn from "@/utils/cn";
import getOs from "@/utils/get-os";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { ToastContainer, Zoom } from "react-toastify";
import "./globals.css";
import AlertProvider from "@/provider/alert-provider";

declare global {
  interface Window {
    kakao: any;
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const pretendard = localFont({
  src: [
    {
      path: "./assets/Pretendard-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./assets/Pretendard-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./assets/Pretendard-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./assets/Pretendard-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./assets/Pretendard-ExtraBold.woff",
      weight: "800",
      style: "normal",
    },
  ],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.k-pullup.com"),
  title: "대한민국 철봉 지도",
  keywords: "철봉지도,위치등록,철봉정보,채팅,위치검색,관리,철봉찾기",
  description:
    "대한민국 철봉 지도에서 전국 공원의 철봉 위치를 직접 등록하고 조회하세요.",
  openGraph: {
    type: "website",
    url: "https://www.k-pullup.com",
    title: "대한민국 철봉 지도",
    description:
      "대한민국 철봉 지도에서 전국 공원의 철봉 위치를 직접 등록하고 조회하세요.",
    images: "/metaimg.webp",
  },
  twitter: {
    card: "summary_large_image",
    title: "대한민국 철봉 지도",
    description:
      "대한민국 철봉 지도에서 전국 공원의 철봉 위치를 직접 등록하고 조회하세요.",
    images: "/metaimg.webp",
  },
  verification: {
    google: "xsTAtA1ny-_9QoSKUsxC7zk_LljW5KBbcWULaNl2gt8",
    other: { naver: "d1ba940a668490789711101918c8b1f7e221a178" },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const userAgent = (await headersList).get("user-agent");

  const os = getOs(userAgent || "");

  return (
    <html lang="ko" className={`${pretendard.className}`}>
      <body>
        <AlertProvider>
          <MapProvider>
            <CheckFirstVisitProvider>
              <div className="relative h-dvh bg-white max-w-[480px] mx-auto overflow-hidden">
                <PageTransitionProvider os={os}>
                  {children}
                </PageTransitionProvider>
              </div>
            </CheckFirstVisitProvider>
          </MapProvider>
        </AlertProvider>
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          transition={Zoom}
          className={cn(
            "sm:left-1/2 sm:-translate-x-1/2 sm:w-[90%]",
            os === "iOS" ? "top-14" : ""
          )}
        />
      </body>
    </html>
  );
}

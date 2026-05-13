import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShiftMate Korea - 교대근무 맞춤 루틴 플래너",
  description:
    "4조3교대, 3조2교대, 2교대, 주야비, 야간근무자를 위한 수면·운동·공부·부업 루틴 생성 웹앱",
  keywords: [
    "교대근무 루틴",
    "4조3교대",
    "3조2교대",
    "2교대",
    "주야비",
    "야간근무 수면",
    "교대근무 부업",
    "교대근무 운동",
  ],
  openGraph: {
    title: "ShiftMate Korea - 교대근무 맞춤 루틴 플래너",
    description:
      "회사마다 다른 D/S/G/N/Off 근무표에 맞춰 수면·운동·공부·부업 루틴을 정리하는 웹앱",
    url: "https://shiftmate-korea.pages.dev/",
    siteName: "ShiftMate Korea",
    locale: "ko_KR",
    type: "website",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

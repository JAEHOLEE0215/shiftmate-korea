import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShiftMate Korea - 교대근무 루틴·월간 근무표 플래너",
  description:
    "교대근무자를 위한 월간 근무표, 반복 패턴, 수면·회복·공부·부업 루틴 플래너",
  keywords: [
    "교대근무 루틴",
    "월간 근무표",
    "반복 교대 패턴",
    "4조3교대",
    "3조2교대",
    "2교대",
    "주야비",
    "야간근무 수면",
    "교대근무 부업",
    "교대근무 운동",
    "교대근무 캘린더",
  ],
  openGraph: {
    title: "ShiftMate Korea - 교대근무 루틴·월간 근무표 플래너",
    description:
      "회사마다 다른 D/S/G/N/Off 근무표에 맞춰 월간 캘린더와 생활 루틴을 정리하는 웹앱",
    url: "https://shiftmate-korea.pages.dev/",
    siteName: "ShiftMate Korea",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ShiftMate Korea - 교대근무 루틴·월간 근무표 플래너",
    description: "교대근무자를 위한 월간 근무표, 반복 패턴, 수면·회복·공부·부업 루틴 플래너",
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

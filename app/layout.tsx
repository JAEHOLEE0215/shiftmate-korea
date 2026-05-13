import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShiftMate Korea - 교대근무 루틴·수면·부업 플래너",
  description:
    "4조3교대, 야간근무, 교대근무자를 위한 수면·운동·공부·부업 루틴 생성 웹앱",
  keywords: ["4조3교대", "교대근무 루틴", "야간근무 수면", "교대근무 부업", "교대근무 운동"],
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

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShiftMate Korea",
  description: "한국 교대근무자를 위한 루틴 자동 생성 웹앱",
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

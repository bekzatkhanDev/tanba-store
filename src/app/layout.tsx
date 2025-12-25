import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Header from "@/components/Header";
import Menu from "@/components/Menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tanba.store Astana",
  description: "tanba store astana e-catalog",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ===== Shop Layout Wrapper ===== */}
        <div className="min-h-screen bg-gray-100 flex flex-col">
          {/* ===== Header ===== */}
          <Header />

          {/* ===== Page content ===== */}
          <main className="flex-1 flex justify-center">
            <div className="w-full max-w-7xl px-4 py-6">{children}</div>
          </main>

          {/* ===== Bottom Menu ===== */}
          <Menu />
        </div>
      </body>
    </html>
  );
}
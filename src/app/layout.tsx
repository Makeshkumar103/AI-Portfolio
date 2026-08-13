import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Makeshkumar — Full Stack & AI Engineer",
  description: "Portfolio of Makeshkumar, Full Stack & AI Engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col relative text-[#1e2235]">
        {/* Background Mesh and Blurs */}
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#f7f8fd]">
          <div
            className="absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage: 'linear-gradient(to right, #1e22350a 1px, transparent 1px), linear-gradient(to bottom, #1e22350a 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, #000 50%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, #000 50%, transparent 100%)'
            }}
          ></div>
          <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-violet-300/30 blur-[100px]"></div>
          <div className="absolute top-1/4 -right-24 h-[26rem] w-[26rem] rounded-full bg-pink-300/25 blur-[100px]"></div>
          <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-teal-200/25 blur-[100px]"></div>
        </div>

        {children}
      </body>
    </html>
  );
}

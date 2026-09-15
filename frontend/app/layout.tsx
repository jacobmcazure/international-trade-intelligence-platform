import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Footer from "./components/Footer";

// API data is available at runtime, not while building the Docker image.
export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trade Intel",
  description: "Global trade intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-slate-900 text-slate-100">
        <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-700/70 bg-slate-900/90 backdrop-blur-md">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3 text-slate-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-cyan-300 to-teal-300 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/30">
                TI
              </span>
              <span className="text-base font-semibold tracking-[0.24em] uppercase">
                Trade Intel
              </span>
            </Link>

            <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <Link href="/explore" className="transition hover:text-white">
                Explore
              </Link>
              <Link href="/about" className="transition hover:text-white">
                About
              </Link>
            </div>
          </nav>
        </header>
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

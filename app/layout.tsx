import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Self-hosted so icons never fall back to rendering their ligature name as text.
// display: 'block' (not 'swap') keeps the raw word from flashing before the font resolves.
const materialSymbols = localFont({
  src: "./fonts/material-symbols-outlined.woff2",
  weight: "100 700",
  style: "normal",
  display: "block",
  variable: "--font-material-symbols",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Bharat Clinic — Modern Healthcare SaaS for Indian Clinics",
  description: "Manage patients, appointments, consultations and prescriptions from one simple workspace built for busy Indian clinics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${materialSymbols.variable}`}>
      <body className="bg-surface text-slate-900 font-sans antialiased selection:bg-brand-100 selection:text-brand-700 min-h-screen">
        {children}
      </body>
    </html>
  );
}

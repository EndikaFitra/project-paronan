import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Figtree, Geist_Mono, Kalam } from "next/font/google";
import "./globals.css";

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-kalam",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-geist-mono",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Split Bill",
  description: "Bagi tagihan bareng, tanpa ribet.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="id"
      className={`h-full antialiased ${kalam.variable} ${geistMono.variable} ${figtree.variable}`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}

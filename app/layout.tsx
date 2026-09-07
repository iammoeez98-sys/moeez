import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Moiz Tahir — UI/UX Designer",
  description: "One face in every crowd that designs the experience.",
};

import { CustomCursorWrapper } from "@/components/v1/CustomCursorWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} ${caveat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <CustomCursorWrapper>
          {children}
        </CustomCursorWrapper>
      </body>
    </html>
  );
}

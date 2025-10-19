import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import {NextIntlClientProvider} from 'next-intl';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jason Su - Software Engineer",
  description: "Jason is a Software Engineer, Fullstack Developer, and a coffee enthusiast!",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  openGraph: {
    title: "Jason Su - Software Engineer",
    description: "Jason is a Software Engineer, Fullstack Developer, and a coffee enthusiast!",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Jason Su",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Jason Su - Software Engineer",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jason Su - Software Engineer",
    description: "Jason is a Software Engineer, Fullstack Developer, and a coffee enthusiast!",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
        <SiteFooter />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

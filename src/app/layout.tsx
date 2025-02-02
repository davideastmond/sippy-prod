import type { Metadata } from "next";
import { Lato, Montserrat } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/global/Navbar";
import LoadingWidget from "@/components/loading-widget/Loading-widget";
import { NextUIProvider } from "@nextui-org/system";
import { NextAuthProvider } from "./providers/NextAuth";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal"],
  display: "swap",
  preload: true,
  variable: "--font-lato",
});
const montserrat = Montserrat({
  subsets: ["cyrillic", "latin"],
  style: ["italic", "normal"],
  weight: ["200", "300", "400", "500", "600", "700"],
  preload: true,
  variable: "--font-montserrant",
});

export const metadata: Metadata = {
  title: "Sippy Solar Panels",
  description:
    "Empower Los Angeles residents to embrace solar energy through an easy-to-use web application that streamlines scheduling for free solar panel evaluations, supporting the city's mission to combat global warming.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${montserrat.variable} antialiased`}>
        <NextAuthProvider>
          <NextUIProvider>
            <Navbar />
            <LoadingWidget />
            {children}
          </NextUIProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

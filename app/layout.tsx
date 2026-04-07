import "./globals.css";

import { Inter } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const astroneerFont = localFont({
  src: "../public/fonts/astroneer.ttf",
  variable: "--font-astroneer",
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body
        style={{
          backgroundColor: "#F3F6FC",
          backgroundImage: "url('/bg.svg')",
          backgroundPosition: "center 55%",
          backgroundRepeat: "no-repeat",

          fontFamily: "astroneerFont",
        }}
        className="min-h-screen"
      >

        <div className="min-h-screen flex items-center justify-center w-full max-w-xl mx-auto px-10 py-6">
          {children}
        </div>

      </body>
    </html>
  )
}
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
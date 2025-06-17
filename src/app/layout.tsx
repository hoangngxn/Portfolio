import { Providers } from "@/components/providers"
import "./globals.css"
import MediaPlayer from "@/components/MediaPlayer"

export const metadata = {
  title: 'hoang.dev',
  description: 'hoang.dev',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: '/favicon/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome', url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'android-chrome', url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-screen">
        <Providers>
          {children}
          <MediaPlayer />
        </Providers>
      </body>
    </html>
  )
}

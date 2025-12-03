import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

import { Outfit } from 'next/font/google'

const outfit = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gasless Token Swap',
  description: 'Swap tokens without gas fees using Privy and ZeroDev',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

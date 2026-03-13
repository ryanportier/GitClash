import type { Metadata } from 'next'
import { Press_Start_2P, Share_Tech_Mono } from 'next/font/google'
import './globals.css'

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
})

const monoFont = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GitClash',
  description: 'Connect your GitHub. Generate your fighter. Clash.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pixelFont.variable} ${monoFont.variable}`}>
      <body className="bg-void-950 text-void-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI CAPTAINS | COMMAND THE FUTURE. NAVIGATE WITH POWER.',
  description: 'Build with AI, not limits. AI CAPTAINS helps you build.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

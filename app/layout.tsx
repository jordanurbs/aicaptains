import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI CAPTAINS ACADEMY | COMMAND YOUR FUTURE. NAVIGATE WITH POWER.',
  description: 'Build with AI, not limits. AI CAPTAINS ACADEMY helps you build.',
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

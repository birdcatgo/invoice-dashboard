import './globals.css'
import type { Metadata } from 'next/types'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Invoice Dashboard',
  description: 'Network invoice management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen bg-gray-100">
        <Navigation />
        {children}
      </body>
    </html>
  )
}
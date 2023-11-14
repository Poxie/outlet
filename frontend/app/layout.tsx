import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'

const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Åhlens Outlet',
  description: 'Vi erbjuder mode, hem och skönhet till 30-70 procents lägre pris än i övriga butiker. I våra varuhus finns såväl etablerade varumärken som vi är vana att se på Åhléns, liksom nya och tillfälliga kollektioner.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}

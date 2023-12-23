import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Banner from '@/components/banner';
import Providers from '@/contexts';
import Footer from '@/components/footer';

const title = 'Åhlens Outlet';
const description = 'Vi erbjuder mode, hem och skönhet till 30-70 procents lägre pris än i övriga butiker. I våra varuhus finns såväl etablerade varumärken som vi är vana att se på Åhléns, liksom nya och tillfälliga kollektioner.';
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: title,
    locale: 'sv-SE',
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Providers>
        <Banner />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </Providers>
    </html>
  )
}

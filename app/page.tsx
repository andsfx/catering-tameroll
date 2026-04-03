import MainHomePage from '@/components/home/MainHomePage'
import MenuLandingPage from '@/components/menu-landing/MenuLandingPage'

const siteVariant = process.env.NEXT_PUBLIC_SITE_VARIANT

export default function Home() {
  if (siteVariant === 'menu-landing') {
    return <MenuLandingPage />
  }

  return <MainHomePage />
}

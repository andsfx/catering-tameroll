import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import MenuShowcase from '@/components/MenuShowcase'
import ValueProps from '@/components/ValueProps'
import HowToOrder from '@/components/HowToOrder'
import Testimonials from '@/components/Testimonials'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import MobileBottomBar from '@/components/MobileBottomBar'

export default function Home() {
  return (
    <main className="min-h-screen bg-cream-50">
      <Navbar />
      <Hero />
      <About />
      <MenuShowcase />
      <ValueProps />
      <HowToOrder />
      <Testimonials />
      <CTASection />
      <Footer />
      <WhatsAppButton />
      <MobileBottomBar />
    </main>
  )
}
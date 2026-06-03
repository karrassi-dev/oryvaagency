import { Hero } from '@/components/home/Hero'
import { ServicesOverview } from '@/components/home/ServicesOverview'
import { WhyChoose } from '@/components/home/WhyChoose'
import { Industries } from '@/components/home/Industries'
import { Process } from '@/components/home/Process'
import { CTA } from '@/components/home/CTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <WhyChoose />
      <Industries />
      <Process />
      <CTA />
    </>
  )
}

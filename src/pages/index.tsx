import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import { HowWeDifferent } from '@/components/home/HowWeDifferent';
import Pricing from '@/components/home/Pricing';
import Promo from '@/components/home/Promo';
import Roadmap from '@/components/home/Roadmap/Roadmap';
import Testimonials from '@/components/home/Testimonials';
import WhyUs from '@/components/home/WhyUs';
import Nav from '@/components/Nav';
import Seo from '@/components/Seo';

export default function HomePage() {
  return (
    <>
      <Seo templateTitle='Incentivise your network & grow your business' />

      <main>
        <div className='relative overflow-hidden bg-dark'>
          <div
            className='hidden sm:block sm:absolute sm:inset-0'
            aria-hidden='true'
          >
            <svg
              className='absolute bottom-0 right-0 mb-48 text-dark transform translate-x-1/2 lg:top-0 lg:mt-28 lg:mb-0 xl:transform-none xl:translate-x-0'
              width={364}
              height={384}
              viewBox='0 0 364 384'
              fill='none'
            >
              <defs>
                <pattern
                  id='eab71dd9-9d7a-47bd-8044-256344ee00d0'
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits='userSpaceOnUse'
                >
                  <rect x={0} y={0} width={4} height={4} fill='currentColor' />
                </pattern>
              </defs>
              <rect
                width={364}
                height={384}
                fill='url(#eab71dd9-9d7a-47bd-8044-256344ee00d0)'
              />
            </svg>
          </div>
          <div className='relative pt-6 pb-16 sm:pb-24'>
            <div className='w-full'>
              <Nav />
            </div>
            <div className='w-full'>
              <Hero />
            </div>
            <div className='w-full bg-white'>
              <WhyUs />
            </div>
            <div className='w-full bg-light-green'>
              <Promo />
            </div>
            <div className='w-full bg-white'>
              <HowItWorks />
            </div>
            <div className='w-full bg-white'>
              <HowWeDifferent />
            </div>
            <div className='w-full bg-light-green'>
              <Testimonials />
            </div>
            <div id='roadmap' className='w-full bg-white'>
              <Roadmap />
            </div>
            <div className='w-full'>
              <Footer />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

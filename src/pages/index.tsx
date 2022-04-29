import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import { HowWeDifferent } from '@/components/home/HowWeDifferent';
import Pricing from '@/components/home/Pricing';
import Promo from '@/components/home/Promo';
import Roadmap from '@/components/home/Roadmap/Roadmap';
import Testimonials from '@/components/home/Testimonials';
import WhyUs from '@/components/home/WhyUs';
import Seo from '@/components/Seo';

import DefaultLayout from '@/layouts/Default';

export default function HomePage() {
  return (
    <>
      <Seo templateTitle='Incentivise your network & grow your business' />
      <DefaultLayout>
        <div className='w-full bg-dark pt-16 pb-16 px-2'>
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
      </DefaultLayout>
    </>
  );
}

import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import { HowWeDifferent } from '@/components/home/HowWeDifferent';
import Pricing from '@/components/home/Pricing';
import Promo from '@/components/home/Promo';
import Nav from '@/components/Nav';
import Seo from '@/components/Seo';
import PrivacyContent from '@/pages/legal/PrivacyContent';

export default function Privacy() {
  return (
    <>
      <Seo templateTitle='Privacy Policy' />
      <main>
        <div className='relative overflow-hidden bg-white'>
          <div>
            <div className='w-full py-5 bg-dark'>
              <Nav />
            </div>
            <div className='w-full text-dark bg-white px-5 my-10 document'>
              <PrivacyContent />
            </div>
            <div className='w-full bg-dark'>
              <Footer />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

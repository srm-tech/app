import Footer from '@/components/Footer';
import Pricing from '@/components/home/Pricing';
import NewNav from '@/components/NewNav';
import NewsLetter from '@/components/promotion/NewsLetter';
import Seo from '@/components/Seo';

export default function PromotionPage() {
  return (
    <>
      <Seo templateTitle='Special Offer' />

      <main>
        <div className='relative overflow-hidden'>
          <div
            className='hidden sm:block sm:absolute sm:inset-0'
            aria-hidden='true'
          >
            <svg
              className='absolute bottom-0 right-0 mb-48 transform translate-x-1/2 lg:top-0 lg:mt-28 lg:mb-0 xl:transform-none xl:translate-x-0'
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
          <div className='relative pb-16 sm:pb-24'>
            <div className='w-full pt-6 bg-white'>
              <NewNav />
            </div>

            <div className='w-full pt-6 bg-white'>
              <div className='flex flex-col items-center px-4 pt-24 mx-auto sm:pt-32 max-w-7xl sm:px-6 lg:px-8'>
                <h2 className='text-4xl text-center text-dark lg:text-5xl xl:text-6xl'>
                  Service Provider’s early bird promo
                </h2>
                <p
                  className='mt-8 text-xl text-center text-gray-400 lg:text-2xl xl:text-3xl sm:w-11/12 sm:leading-none sm:tracking-tight'
                  style={{ lineHeight: 1.3 }}
                >
                  Limited offer only for early adopters. Don't Miss Out! Sign
                  up. now!
                </p>
              </div>
            </div>

            <div className='w-full bg-white'>
              <Pricing />
            </div>
            <div id='contact' className='w-full bg-gray-100'>
              <NewsLetter />
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

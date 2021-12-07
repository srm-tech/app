import Link from 'next/link';

import Footer from '@/components/Footer';
import NewNav from '@/components/NewNav';
import NewsLetter from '@/components/promotion/NewsLetter';
import Seo from '@/components/Seo';

export default function StripeConfirmationPage() {
  return (
    <>
      <Seo templateTitle='Successful subscribe' />

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

            <div className='w-full bg-white h-pt-6 sm:pb-12'>
              <div className='flex flex-col items-center px-4 pt-24 mx-auto sm:pt-32 max-w-7xl sm:px-6 lg:px-8'>
                <h2 className='text-4xl text-center text-dark lg:text-5xl xl:text-6xl'>
                  Thank you for subscribing!
                </h2>
                <p
                  className='mt-8 text-xl text-center text-gray-400 lg:text-2xl xl:text-3xl sm:w-11/12 sm:leading-none sm:tracking-tight'
                  style={{ lineHeight: 1.3 }}
                >
                  You have successfully subscribed the service, thanks!
                </p>

                <Link href='/'>
                  <a className='flex items-center justify-center px-4 py-2 text-base font-medium text-white border border-transparent rounded-md bg-primary-400 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 sm:mt-8'>
                    Go back home
                  </a>
                </Link>
              </div>
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

import Link from 'next/link';
export default function Promo() {
  return (
    <div className='flex flex-col justify-between px-4 mx-auto align-middle sm:flex-row py-14 max-w-7xl sm:px-6 lg:px-8'>
      <h1
        className='w-full text-4xl font-extrabold tracking-tight text-center text-dark sm:text-left sm:w-2/4 lg:text-5xl'
        style={{ lineHeight: 1.3 }}
      >
        Access exclusive{' '}
        <text className='text-white opacity-80'>
          early-bird promotion and benefits
        </text>
      </h1>
      <div className='self-center mt-8 sm:mt-0'>
        <Link href='/promotion' passHref>
          <a className='inline-flex items-center py-2 sm:py-3.5 text-base sm:text-xl text-white bg-dark-green border border-transparent rounded-md shadow-sm px-7 hover:bg-green-800 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600'>
            View Special Offer
          </a>
        </Link>
      </div>
    </div>
  );
}

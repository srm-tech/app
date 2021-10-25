import dynamic from 'next/dynamic';
const AnimatedComponent = dynamic(() => import('./AnimatedCards'), {
  ssr: false,
});

export default function Roadmap() {
  return (
    <div className='flex flex-col items-center justify-center px-4 py-24 mx-auto sm:py-32 max-w-7xl sm:px-6 lg:px-8'>
      <h1 className='mb-5 text-4xl text-center text-dark lg:text-5xl'>
        Roadmap
      </h1>
      <p className='w-full text-base leading-relaxed text-center text-gray-400 sm:text-xl lg:text-lg xl:text-xl sm:w-2/3'>
        Adopting our platform early will give you many privileges and establish
        presence that will fruit in future business.
      </p>

      <div className='mt-16 sm:mt-20'>
        <AnimatedComponent />
      </div>
    </div>
  );
}

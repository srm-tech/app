import { Icon } from './Icons';

const data = [
  {
    title: 'FIRST STEP',
    desc: 'Omnis, illo delectus? Libero, possimus nulla nemo tenetur adipisci repellat dolore eligendi velit doloribus mollitia.',
  },
  {
    title: 'FIRST STEP',
    desc: 'Omnis, illo delectus? Libero, possimus nulla nemo tenetur adipisci repellat dolore eligendi velit doloribus mollitia.',
  },
  {
    title: 'FIRST STEP',
    desc: 'Omnis, illo delectus? Libero, possimus nulla nemo tenetur adipisci repellat dolore eligendi velit doloribus mollitia.',
  },
];

export default function HowItWorks() {
  return (
    <div className='flex flex-col px-4 py-24 mx-auto align-middle sm:py-32 max-w-7xl sm:px-6 lg:px-8'>
      <p className='mb-5 text-xl text-center text-gray-700 lg:text-2xl sm:leading-none sm:tracking-tight'>
        HOW IT WORKS
      </p>
      <h2 className='text-4xl text-center text-gray-700 lg:text-5xl'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.{' '}
      </h2>

      <div className='flex flex-col self-center mt-20 sm:mt-32 gap-14 sm:gap-24 lg:w-2/5 md:w-full'>
        {data.map((item, index) => (
          <div
            key={`${index}-how-it-work`}
            className='flex flex-row rounded-lg '
          >
            <div className='mr-5 sm:mr-6'>
              <Icon name='howItWorks' width={55} height={55} />
            </div>
            <div className='flex-grow'>
              <h2 className='mb-2 text-lg font-normal text-gray-700 sm:text-xl title-font'>
                {item.title}
              </h2>
              <p className='text-base leading-relaxed sm:text-xl lg:text-lg xl:text-xl opacity-40'>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

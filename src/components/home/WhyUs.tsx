import { Icon, IconName } from './Icons';

const data: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: 'earth',
    title: 'Competitive exchange rates',
    desc: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione. ',
  },
  {
    icon: 'weightScale',
    title: 'No hidden fees',
    desc: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione. ',
  },
  {
    icon: 'lightning',
    title: 'Transfers are instant',
    desc: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione. ',
  },
  {
    icon: 'message',
    title: 'Mobile notifications',
    desc: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione. ',
  },
];

export default function WhyUs() {
  return (
    <div className='px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8'>
      <p className='mb-5 text-xl text-center text-gray-700 lg:text-2xl sm:leading-none sm:tracking-tight'>
        WHY US?
      </p>
      <h2 className='text-4xl text-center text-gray-700 lg:text-5xl'>
        Lorem ipsum dolor sit amet, consectetur elit.
      </h2>

      <div className='grid self-center w-full mt-20 sm:mt-32 gap-14 sm:gap-24 sm:grid-cols-2'>
        {data.map((item, index) => (
          <div
            key={`${index}-how-it-work`}
            className='flex flex-row rounded-lg '
          >
            <div className='mr-6'>
              <Icon name={item.icon} width={55} height={55} />
            </div>
            <div className='flex-grow'>
              <h2 className='mb-2 text-xl font-normal text-gray-700 title-font'>
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

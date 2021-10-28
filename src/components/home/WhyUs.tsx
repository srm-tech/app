import { Icon, IconName } from './Icons';

const data: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: 'clock',
    title: 'Save time',
    desc: 'We facilitate introductions, followups and agreements between partners, so you can focus on your core business.',
  },
  {
    icon: 'inOutArrow',
    title: 'Extend you network',
    desc: 'More exposure, more business! Let everyone know you are open for business and incentivise trusted partners to grow faster.',
  },
  {
    icon: 'shine',
    title: 'Affordable Marketing',
    desc: 'Save $$$ and replace expensive ads platforms with Introduce Gurus that will refer you to the real customers. Pay only after deal is closed.',
  },
  {
    icon: 'people',
    title: 'Targeted Referrals, not leads',
    desc: '92% of consumers trust recommendations from people they know. Introductions via our platform will help you close deals faster.',
  },
];

export default function WhyUs() {
  return (
    <div className='px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8'>
      <p className='mb-5 text-xl text-center text-dark lg:text-2xl sm:leading-none sm:tracking-tight'>
        Why Introduce Guru?
      </p>
      <h2 className='text-4xl text-center text-dark lg:text-5xl'>
        We help your business grow in a sustainable way
      </h2>

      <div className='grid self-center w-full mt-20 sm:mt-32 gap-14 sm:gap-24 sm:grid-cols-2'>
        {data.map((item, index) => (
          <div
            key={`${index}-how-it-work`}
            className='flex flex-row rounded-lg '
          >
            <div className='mr-6 text-light-green'>
              <Icon name={item.icon} width={60} height={60} />
            </div>
            <div className='flex-grow'>
              <h2 className='mb-2 text-xl font-normal text-dark title-font'>
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

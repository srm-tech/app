import clsx from 'clsx';

import { RoadMapIcon } from '../RoadMapIcons';

const data = [
  {
    icon: 'shine',
    date: '01 OCT 2021',
    desc: 'Launch of landing page. Beginning of building Guru Community.',
  },
  {
    icon: 'community',
    date: '01 NOV 2021',
    desc: 'Launch of monthly networking meetings.',
  },
  {
    icon: 'lightning',
    date: '20 DEC 2021',
    desc: 'Launch of BETA version.',
  },
  {
    icon: 'calendar',
    date: '28 JAN 2021',
    desc: 'Launch Event in Sydney.',
  },
  {
    icon: 'star',
    date: '01 APR 2021',
    desc: 'Launch of ALPHA version.',
  },
  {
    icon: 'grow',
    date: '01 JUL 2021',
    desc: 'Launch of quarterly updates, functionality improvements.',
  },
];

export default function AnimatedCards() {
  return (
    <div className='timeline'>
      {data.map((item, index) => {
        const nth = index % 2 !== 0;
        const isLast = data.length - 1 === index;

        return (
          <div
            key={`${index}-${item.icon}`}
            className={clsx(
              'flex items-center mb-10 sm:mb-14 roadmap-itm',
              nth && 'flex-row-reverse'
            )}
          >
            <div
              className='w-full p-5 shadow-lg bg-light-green sm:p-8 sm:pr-20 rounded-2xl'
              style={{ height: 'fit-content' }}
            >
              <h6 className='mb-2 text-lg font-normal text-gray-700 sm:text-xl title-font'>
                {item.date}
              </h6>
              <p className='text-base leading-relaxed text-gray-400 sm:w-96 sm:text-xl lg:text-lg xl:text-xl'>
                {item.desc}
              </p>
            </div>
            <div
              className={clsx(
                'relative z-10 flex w-16 h-16 bg-dark-green before:bg-dark-green after:bg-dark-green rounded-full icon flex-shrink-0 before:w-3 sm:before:w-9',
                nth
                  ? 'l-icon mr-5 sm:mr-14  before:ml-1 sm:before:ml-2.5'
                  : 'r-icon before:mr-1 sm:before:mr-2.5 ml-5 sm:ml-14',
                isLast ? 'after:h-0' : 'after:h-3/5 sm:after:h-full'
              )}
            >
              <RoadMapIcon width={38} height={38} name={item.icon} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

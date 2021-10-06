import clsx from 'clsx';

import { RoadMapIcon } from '../RoadMapIcons';

const data = [
  {
    icon: 'shine',
    date: '28 SEPT 2021',
    desc: 'Omnis, illo delectus? Libero, possimus nulla nemo tenetur adipisci repellat dolore eligendi velit doloribus mollitia.',
  },
  {
    icon: 'community',
    date: '28 SEPT 2021',
    desc: 'Omnis, illo delectus? Libero, possimus nulla nemo tenetur adipisci repellat dolore eligendi velit doloribus mollitia.',
  },
  {
    icon: 'lightning',
    date: '28 SEPT 2021',
    desc: 'Omnis, illo delectus? Libero, possimus nulla nemo tenetur adipisci repellat dolore eligendi velit doloribus mollitia.',
  },
  {
    icon: 'calendar',
    date: '28 SEPT 2021',
    desc: 'Omnis, illo delectus? Libero, possimus nulla nemo tenetur adipisci repellat dolore eligendi velit doloribus mollitia.',
  },
  {
    icon: 'star',
    date: '28 SEPT 2021',
    desc: 'Omnis, illo delectus? Libero, possimus nulla nemo tenetur adipisci repellat dolore eligendi velit doloribus mollitia.',
  },
  {
    icon: 'grow',
    date: '28 SEPT 2021',
    desc: 'Omnis, illo delectus? Libero, possimus nulla nemo tenetur adipisci repellat dolore eligendi velit doloribus mollitia.',
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
              className='p-5 bg-gray-50 sm:p-8 sm:pr-20 rounded-2xl'
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
                'relative z-10 flex w-20 h-20 bg-gray-50 rounded-full icon flex-shrink-0 before:w-3 sm:before:w-9',
                nth
                  ? 'l-icon mr-5 sm:mr-14 before:ml-1 sm:before:ml-2.5'
                  : 'r-icon before:mr-1 sm:before:mr-2.5 ml-5 sm:ml-14',
                isLast ? 'after:h-0' : 'after:h-full'
              )}
            >
              <RoadMapIcon name={item.icon} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

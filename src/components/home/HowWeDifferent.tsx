const data = [
  {
    title: 'Is Introduce Guru another CRM?',
    desc: 'No. We only facilitate introductions and referral management. Introduce Guru integrates with other CRMs.',
  },
  {
    title: 'Is this another lead sales website?',
    desc: 'No. We don’t provide or sell leads. You will only receive referrals from a trusted network of businesses or individuals.',
  },
  {
    title: 'How are you different from other platforms?',
    desc: 'At Introduce Guru there is no bidding for leeds nor advertising. We are business centric, transparent. We support organic growth via healthy referral incentives.',
  },
  {
    title: 'Can I afford it?',
    desc: 'Yes. Any business can use the platform for free without any cost of advertising. Premium paid subscription is available to businesses which generate more revenue from using Introduce Guru.',
  },
];

export const HowWeDifferent = () => {
  return (
    <div className='px-4 pt-10 mx-auto pb-36 max-w-7xl sm:px-6 lg:px-8'>
      <h2 className='text-4xl text-center text-dark lg:text-5xl'>
        How are we different?
      </h2>
      <div className='grid self-center w-full mt-20 sm:mt-32 gap-14 sm:gap-24 sm:grid-cols-2'>
        {data.map((item, index) => (
          <div
            key={`${index}-how-it-work`}
            className='flex flex-row rounded-lg '
          >
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
};

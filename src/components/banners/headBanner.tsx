type BannerProps = {
  children: React.ReactNode;
};

export default function HeadBanner({ children = '' }: BannerProps) {
  return (
    <div className='relative bg-yellow-100'>
      <div className='px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='pr-16 sm:text-center sm:px-16'>
          <p className='font-medium text-yellow-500'>
            <span>{children}</span>
          </p>
        </div>
        {/* <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
          <button
            type="button"
            className="flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span className="sr-only">Dismiss</span>
            <XIcon className="w-6 h-6 text-white" aria-hidden="true" />
          </button>
        </div> */}
      </div>
    </div>
  );
}

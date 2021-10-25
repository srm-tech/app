export default function Testimonials() {
  return (
    <div className='flex justify-center px-4 py-32 mx-auto max-w-7xl sm:px-6 lg:px-8'>
      <div className='flex flex-col items-center self-center justify-center w-full sm:w-1/2'>
        <img
          className='self-center'
          src='/home/testimonials/personal-painters.png'
          width={200}
        />
        <p className='mt-8 text-xl font-thin text-center opacity-60'>
          “We are always looking to grow our business and thanks to Introduce
          Guru we can create incentive programs for our customers to refer our
          service to their friends and relatives.”
        </p>
        <div className='flex items-center mt-8'>
          {/* <img src='/home/testimonials/workcation_avatar.png' width={40} /> */}
          <p className='ml-3 mr-2 text-lg opacity-60'>Michael S</p>
          <h4 className='opacity-60'>/</h4>
          <p className='ml-2 text-lg opacity-40'>Managing Director</p>
        </div>
      </div>
    </div>
  );
}

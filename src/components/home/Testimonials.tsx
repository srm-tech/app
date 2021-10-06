export default function Testimonials() {
  return (
    <div className='flex justify-center px-4 py-32 mx-auto max-w-7xl sm:px-6 lg:px-8'>
      <div className='flex flex-col items-center self-center justify-center w-full sm:w-1/2'>
        <img
          className='self-center'
          src='/home/testimonials/workcation_logo.svg'
          width={200}
        />
        <p className='mt-8 text-xl font-thin text-center opacity-60'>
          “Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo
          expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in
          laborum sed rerum et corporis.”
        </p>
        <div className='flex items-center mt-8'>
          <img src='/home/testimonials/workcation_avatar.png' width={40} />
          <p className='ml-3 mr-2 text-lg opacity-40'>Judith Black</p>
          <h4 className='opacity-60'>/</h4>
          <p className='ml-2 text-lg opacity-40'>CEO, Workcation</p>
        </div>
      </div>
    </div>
  );
}

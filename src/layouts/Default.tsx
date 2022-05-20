import Footer from '@/components/Footer';
import Nav from '@/components/Nav';

export default function DefaultLayout({ children }) {
  return (
    <main>
      <div className='relative overflow-hidden'>
        <div className='relative'>
          <div className='w-full bg-dark px-4'>
            <Nav />
          </div>
          <div className=''>{children}</div>
          <div className='w-full bg-dark px-4'>
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
}

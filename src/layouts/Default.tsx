import Footer from '@/components/Footer';
import Nav from '@/components/Nav';

export default function DefaultLayout({ children }) {
  return (
    <main>
      <div className='relative overflow-hidden'>
        <div className='relative'>
          <div className='w-full bg-dark px-2 py-4'>
            <Nav />
          </div>
          {children}
          <div className='w-full bg-dark'>
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
}

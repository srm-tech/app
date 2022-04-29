import Footer from '@/components/Footer';
import Nav from '@/components/Nav';

export default function DefaultLayout({ children }) {
  return (
    <main>
      <div className='relative overflow-hidde'>
        <div className='relative'>
          <div className='w-full bg-dark pt-6 px-2'>
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

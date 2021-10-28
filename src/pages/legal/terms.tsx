import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import Seo from '@/components/Seo';
import TermsContent from '@/pages/legal/TermsContent';

export default function Terms() {
  return (
    <>
      <Seo templateTitle='Terms & Conditions' />
      <main>
        <div className='relative overflow-hidden bg-white'>
          <div>
            <div className='w-full py-5 bg-dark'>
              <Nav />
            </div>
            <div className='w-full text-dark bg-white px-5 my-10 document'>
              <TermsContent />
            </div>
            <div className='w-full bg-dark'>
              <Footer />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

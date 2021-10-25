import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link
            rel='preconnect'
            href='https://fonts.gstatic.com'
            crossOrigin='true'
          />
          <link
            href='https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,400;0,500;1,300&display=swap'
            rel='stylesheet'
          />
        </Head>
        <body className=''>
          <Main />
          <NextScript />
          <script
            async
            src='https://www.googletagmanager.com/gtag/js?id=G-EMFVVLT2ME'
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-EMFVVLT2ME')`,
            }}
          />
        </body>
      </Html>
    );
  }
}
export default MyDocument;

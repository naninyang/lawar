import type { AppProps, AppContext } from 'next/app';
import NextApp from 'next/app';
import { Noto_Sans_KR } from 'next/font/google';
import { RecoilRoot } from 'recoil';
import TimeInitializer from '@/components/TimeInitializer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MoveToTop from '@/components/MoveToTop';
import '@/styles/globals.sass';

const font = Noto_Sans_KR({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['cyrillic'],
});

type LastwarAppProps = AppProps & {
  initialServerTime: string;
};

export default function LastwarApp({ Component, pageProps, initialServerTime }: LastwarAppProps) {
  return (
    <RecoilRoot>
      <TimeInitializer initialServerTime={initialServerTime} />
      <div className="content">
        <style jsx global>
          {`
            body,
            pre,
            input,
            button,
            textarea {
              font-family: ${font.style.fontFamily}, sans-serif;
              font-weight: 400;
            }
          `}
        </style>
        <Header />
        <Component {...pageProps} />
        <Footer />
        <MoveToTop />
      </div>
    </RecoilRoot>
  );
}

LastwarApp.getInitialProps = async (appContext: AppContext) => {
  const serverTime = new Date().toISOString();

  const appProps = await NextApp.getInitialProps(appContext);

  return {
    ...appProps,
    initialServerTime: serverTime,
  };
};

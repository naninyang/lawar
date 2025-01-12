import { useEffect, useState } from 'react';
import type { AppProps, AppContext } from 'next/app';
import NextApp from 'next/app';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import { useMediaQuery } from 'react-responsive';
import { RecoilRoot } from 'recoil';
import { GA_TRACKING_ID, pageview } from '@/lib/gtag';
import TimeInitializer from '@/components/TimeInitializer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Aside from '@/components/Aside';
import MoveToTop from '@/components/MoveToTop';
import DaerogiHeader from '@/components/daerogi/Header';
import DaerogiFooter from '@/components/daerogi/Footer';
import '@/styles/globals.sass';
import ToggleMenu from '@/components/ToggleMenu';

type LastwarAppProps = AppProps & {
  initialServerTime: string;
};

const font = Noto_Sans_KR({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['cyrillic'],
});

const Square = localFont({
  src: './fonts/NanumSquareNeoVF.woff2',
  style: 'normal',
  variable: '--square',
});

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const mobile = useMediaQuery({
    query: `(max-width: ${991 / 16}rem)`,
  });
  useEffect(() => {
    setIsMobile(mobile);
  }, [mobile]);
  return isMobile;
}

export default function LastwarApp({ Component, pageProps, initialServerTime }: LastwarAppProps) {
  const router = useRouter();
  const isMobile = useMobile();

  useEffect(() => {
    const handleRouteChange = (url: any) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <RecoilRoot>
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
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      <TimeInitializer initialServerTime={initialServerTime} />
      {router.pathname === '/daerogi' ||
      router.pathname === '/daerogi/managements/[managementId]' ||
      router.pathname === '/daerogi/matching/[matchingId]' ||
      router.pathname === '/daerogi/toolboxes/[toolboxId]' ||
      router.pathname === '/daerogi/login' ? (
        <div className="content">
          <DaerogiHeader />
          <Component {...pageProps} />
          <DaerogiFooter />
          <MoveToTop />
        </div>
      ) : (
        <div className={`content ${Square.variable}`}>
          {isMobile ? (
            <>
              <Header />
              <Component {...pageProps} />
              <Footer />
              <MoveToTop />
            </>
          ) : (
            <>
              <Header />
              <div className="container">
                <Aside />
                <Component {...pageProps} />
              </div>
              <Footer />
              <ToggleMenu />
              <MoveToTop />
            </>
          )}
        </div>
      )}
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

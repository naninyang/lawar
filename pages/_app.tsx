import { useEffect } from 'react';
import type { AppProps, AppContext } from 'next/app';
import NextApp from 'next/app';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { Noto_Sans_KR } from 'next/font/google';
import { RecoilRoot } from 'recoil';
import { GA_TRACKING_ID, pageview } from '@/lib/gtag';
import TimeInitializer from '@/components/TimeInitializer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MoveToTop from '@/components/MoveToTop';
import DaerogiHeader from '@/components/daerogi/Header';
import DaerogiFooter from '@/components/daerogi/Footer';
import '@/styles/globals.sass';

const font = Noto_Sans_KR({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['cyrillic'],
});

type LastwarAppProps = AppProps & {
  initialServerTime: string;
};

export default function LastwarApp({ Component, pageProps, initialServerTime }: LastwarAppProps) {
  const router = useRouter();
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
      router.pathname === '/daerogi/notifications' ||
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
        <div className="content">
          <Header />
          <Component {...pageProps} />
          <Footer />
          <MoveToTop />
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

import { useEffect, useState } from 'react';
import type { AppProps, AppContext } from 'next/app';
import NextApp from 'next/app';
import { Noto_Sans_KR } from 'next/font/google';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { nowTimeState, serverTimeState, serverTimezoneState } from '@/atoms/timeState';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/styles/globals.sass';

const font = Noto_Sans_KR({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['cyrillic'],
});

type LastwarAppProps = AppProps & {
  initialServerTime: string;
  initialServerTimezone: string;
};

function LastwarApp({ Component, pageProps, initialServerTime, initialServerTimezone }: LastwarAppProps) {
  const [fontSize, setFontSize] = useState<number>(16);

  const setServerTime = useSetRecoilState(serverTimeState);
  const setServerTimezone = useSetRecoilState(serverTimezoneState);
  const setNowTime = useSetRecoilState(nowTimeState);

  useEffect(() => {
    localStorage.setItem('serverTime', initialServerTime);
    localStorage.setItem('serverTimezone', initialServerTimezone);
    setServerTime(new Date(initialServerTime));
    setServerTimezone(initialServerTimezone);

    const storedFontSize = localStorage.getItem('fontSize');
    if (storedFontSize) {
      setFontSize(parseInt(storedFontSize, 10));
      document.documentElement.style.fontSize = `${parseInt(storedFontSize, 10)}px`;
    } else {
      document.documentElement.style.fontSize = `16px`;
    }

    const nowUTC = new Date();
    const targetTime = new Date(nowUTC.getTime() - 11 * 60 * 60 * 1000);

    console.log('UTC 시간: ', nowUTC.toISOString());
    console.log('UTC 기준으로 11시간 늦은 시간: ', targetTime.toISOString());

    localStorage.setItem('nowTime', targetTime.toISOString());
    setNowTime(targetTime);
  }, [initialServerTime, initialServerTimezone, setServerTime, setServerTimezone, setNowTime]);

  return (
    <RecoilRoot>
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
      </div>
    </RecoilRoot>
  );
}

LastwarApp.getInitialProps = async (appContext: AppContext) => {
  const serverTime = new Date().toISOString();
  const serverTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const appProps = await NextApp.getInitialProps(appContext);

  return {
    ...appProps,
    initialServerTime: serverTime,
    initialServerTimezone: serverTimezone,
  };
};

export default LastwarApp;

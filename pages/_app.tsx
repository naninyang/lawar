import { useEffect, useState } from 'react';
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
  initialServerTimezone: string;
};

export default function LastwarApp({ Component, pageProps, initialServerTime }: LastwarAppProps) {
  const [fontSize, setFontSize] = useState<number>(16);

  useEffect(() => {
    const storedFontSize = localStorage.getItem('fontSize');
    if (storedFontSize) {
      setFontSize(parseInt(storedFontSize, 10));
      document.documentElement.style.fontSize = `${parseInt(storedFontSize, 10)}px`;
    } else {
      document.documentElement.style.fontSize = `16px`;
    }
  }, []);

  const handleFontSizeChange = (newFontSize: number) => {
    if (newFontSize !== fontSize) {
      setFontSize(newFontSize);
      localStorage.setItem('fontSize', newFontSize.toString());
      document.documentElement.style.fontSize = `${newFontSize}px`;
    }
  };

  const increaseFontSize = () => handleFontSizeChange(fontSize + 8);
  const decreaseFontSize = () => {
    if (fontSize > 16) {
      handleFontSizeChange(fontSize - 8);
    } else {
      alert('더 이상 작게 글씨를 줄일 수 없습니다');
    }
  };
  const resetFontSize = () => handleFontSizeChange(16);

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
        <div className="font-controller">
          <button type="button" onClick={increaseFontSize}>
            크게
          </button>
          <button type="button" onClick={decreaseFontSize}>
            작게
          </button>
          <button type="button" onClick={resetFontSize}>
            초기화
          </button>
        </div>
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

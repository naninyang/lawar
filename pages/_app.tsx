import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { Noto_Sans_KR } from 'next/font/google';
import '@/styles/globals.sass';

const font = Noto_Sans_KR({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['cyrillic'],
});

export default function App({ Component, pageProps }: AppProps) {
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
      <div className="footer">
        <p>본 웹사이트는 482서버 ycl 연맹 클로에(본캐 N1W 연맹 빛이나)가 만든 웹사이트입니다.</p>
        <p>본 웹사이트는 ycl 연맹에서 사용할 목적으로 제작되었습니다.</p>
        <p>
          본 웹사이트는 타 서버 또는 타 연맹의 맹원들도 이용이 가능하나, KST 시간대가 아닌 디바이스에서는 [오늘]
          텍스트가 오작동할 수 있습니다.
        </p>
      </div>
    </div>
  );
}

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko-KR">
      <Head>
        <meta name="application-name" content="라스트워 - 오늘의 테마 (연맹대전)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="Black-translucent" />
        <meta name="apple-mobile-web-app-title" content="라스트워 - 오늘의 테마 (연맹대전)" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#2d334a" />
        <meta name="format-detection" content="telephone=no" />
        <link href="/manifest.json" rel="manifest" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link href="/favicon.ico" rel="shortcut icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

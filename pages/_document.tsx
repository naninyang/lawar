import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko-KR">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="application-name" content="라스트워 - 오늘의 테마 (연맹대전)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="Black-translucent" />
        <meta name="apple-mobile-web-app-title" content="라스트워 - 오늘의 테마 (연맹대전)" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#2d334a" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="description" content="즐라" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:url" content="https://lawar.dev1stud.io" />
        <meta property="og:title" content="라스트워 - 오늘의 테마 (연맹대전)" />
        <meta property="og:site_name" content="라스트워 - 오늘의 테마 (연맹대전)" />
        <meta property="og:description" content="즐라" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lawar.dev1stud.io/og.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link href="/manifest.json" rel="manifest" />
        <link href="/favicon/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/favicon/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link href="/favicon/favicon.ico" rel="shortcut icon" />
        <link rel="canonical" href="https://lawar.dev1stud.io" />
        <link rel="alternate" href="https://lawar.dev1stud.io" hrefLang="ko-KR" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

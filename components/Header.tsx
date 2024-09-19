import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Anchor from './Anchor';
import Events from './Events';
import EventsIngame from './EventsIngame';
import styles from '@/styles/Header.module.sass';

export default function Header() {
  const router = useRouter();
  const menuRef = useRef<HTMLOListElement>(null);
  const [eventsJekyll, setEventsJekyll] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(16);

  const handleMenuClick = (path: string, index: number) => {
    router.push(path);
    if (menuRef.current) {
      const selectedItem = menuRef.current.children[index] as HTMLElement;
      const menuContainerOffset = menuRef.current.offsetLeft;
      const selectedItemOffset = selectedItem.offsetLeft;
      menuRef.current.scrollTo({
        left: selectedItemOffset - menuContainerOffset,
        behavior: 'smooth',
      });
    }
  };

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

  useEffect(() => {
    if (router.pathname !== '/') {
      setEventsJekyll(false);
    } else {
      setEventsJekyll(true);
    }
  }, [router.pathname]);

  return (
    <>
      <header className={styles.header}>
        <h1>
          <Anchor href="/">
            <svg width="191" height="23" viewBox="0 0 191 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M183.847 2.68001L183.031 1.57601L183.439 0.880005C184.423 1.28801 185.863 1.57601 187.447 1.57601L187.567 2.29601L187.279 3.47201V8.00801L187.567 8.488C187.111 9.18401 185.575 10.192 184.135 10.504L183.511 9.68801H174.223C173.551 10.144 172.687 10.552 171.847 10.744L171.223 9.92801L171.559 9.20801V2.68001L170.743 1.57601L171.151 0.880005C172.135 1.28801 173.575 1.57601 175.159 1.57601L175.279 2.29601L174.991 3.35201V3.68801H180.319L181.159 3.304H181.927C182.455 3.736 182.959 4.552 183.223 5.68001L182.863 5.94401L181.447 5.632H174.991V7.64801H183.847V2.68001ZM167.839 11.2L168.175 10.888L169.951 11.416H187.975L188.815 10.96L189.583 11.032C190.111 11.488 190.639 12.496 190.879 13.6L190.519 13.864L189.103 13.552H181.159V15.136H184.519L185.359 14.752H186.343C187.135 15.256 187.543 15.832 187.735 16.744L187.279 17.416V20.416L187.567 20.896C187.063 21.64 185.191 22.624 183.847 22.912L183.223 22.096L183.559 21.376V17.344H173.575L173.023 17.632H172.231C171.415 16.936 170.983 16.24 170.551 14.92L170.887 14.608L172.663 15.136H177.583V13.552H170.863L170.311 13.84H169.519C168.655 13.12 168.223 12.448 167.839 11.2Z"
                fill="white"
              />
              <path
                d="M147.349 2.488L148.765 2.776H161.221L162.061 2.392H162.829C163.357 2.824 163.861 4 164.125 5.128L163.765 5.392L162.349 5.08H152.029V11.56H161.989L162.829 11.176H163.597C164.101 11.608 164.629 12.832 164.893 14.008L164.533 14.272L163.117 13.96H149.557L148.621 14.272L147.997 13.456L148.333 12.736V5.32C147.757 4.768 147.373 3.976 147.013 2.8L147.349 2.488ZM144.565 17.08L144.925 16.72L146.893 17.32H164.413L165.325 16.888H166.189C166.741 17.368 167.317 18.544 167.605 19.888L167.221 20.176L165.637 19.816H147.901L147.301 20.152H146.413C145.525 19.408 145.045 18.616 144.565 17.08Z"
                fill="white"
              />
              <path
                d="M138.116 2.296L137.3 1.192L137.708 0.496002C138.692 0.952002 140.348 1.192 141.884 1.192L142.004 1.912L141.716 2.968V20.296L142.004 20.776C141.476 21.568 139.628 22.528 138.404 22.792L137.78 21.976L138.116 21.256V2.296ZM121.748 10.288C122.132 5.8 123.74 3.472 128.684 2.824C133.628 3.472 135.236 5.8 135.62 10.288C135.236 14.776 133.628 17.104 128.684 17.752C123.74 17.104 122.132 14.776 121.748 10.288ZM125.588 10.24C125.588 12.976 126.548 15.064 128.684 15.064C130.82 15.064 131.78 12.976 131.78 10.24C131.78 7.504 130.82 5.416 128.684 5.416C126.548 5.416 125.588 7.504 125.588 10.24Z"
                fill="white"
              />
              <path
                d="M99.5304 2.92L101.186 3.208H109.538L110.426 2.824H111.242C112.034 3.232 112.586 4.048 112.706 4.984L112.106 5.608C109.682 10.264 106.226 14.488 101.882 17.584C100.61 17.368 99.1464 16.648 98.5224 15.736L98.8104 15.184L99.5784 14.992C103.106 12.352 106.274 8.56 107.834 5.608H102.242L101.666 5.896H100.826C99.9864 5.128 99.5064 4.336 99.1944 3.232L99.5304 2.92ZM113.066 1.192L113.474 0.496002C114.386 0.928002 115.994 1.192 117.65 1.192L117.77 1.912L117.482 2.968V9.328H118.25L119.09 8.944H119.858C120.386 9.4 120.914 10.408 121.154 11.512L120.794 11.776L119.378 11.464H117.482V20.296L117.77 20.776C117.29 21.52 115.514 22.504 114.17 22.792L113.546 21.976L113.882 21.256V2.296L113.066 1.192Z"
                fill="white"
              />
              <path
                d="M87.0043 2.296L86.1883 1.192L86.5963 0.496002C87.5083 0.928002 89.1163 1.192 90.7723 1.192L90.8923 1.912L90.6043 2.968V20.296L90.8923 20.776C90.4123 21.52 88.6363 22.504 87.2923 22.792L86.6683 21.976L87.0043 21.256V18.544H85.4443L84.8923 18.832H84.1003C83.2363 18.112 82.8043 17.44 82.4203 16.192L82.7563 15.88L84.5323 16.408H87.0043V14.128L80.1643 14.536V19.936L80.4523 20.416C79.9723 21.112 78.1003 22.12 76.7083 22.432L76.0843 21.616L76.4203 20.896V14.776L73.2043 14.968L72.6523 15.256H71.8603C71.0203 14.56 70.5883 13.912 70.1803 12.568L70.5163 12.256L72.2923 12.784L87.0043 11.944V2.296ZM71.5723 6.688C71.9083 3.904 73.7323 2.824 78.0283 2.344C82.3243 2.824 84.1723 3.904 84.5083 6.688C84.1723 9.472 82.3243 10.576 78.0283 11.056C73.7323 10.576 71.9083 9.472 71.5723 6.688ZM75.0043 6.64C75.0043 7.744 76.1323 8.536 78.0283 8.536C79.9243 8.536 81.0763 7.744 81.0763 6.64C81.0763 5.536 79.9243 4.768 78.0283 4.768C76.1323 4.768 75.0043 5.536 75.0043 6.64Z"
                fill="white"
              />
              <path
                d="M54.2269 4.888V7.432H62.8429L63.6109 7.072H64.3309C64.8109 7.48 65.2669 8.56 65.5309 9.616L65.1949 9.856L63.8749 9.568H54.2269V12.352H64.1869L64.9789 11.968H65.7469C66.2269 12.4 66.7309 13.576 66.9949 14.728L66.6349 14.992L65.2669 14.68H51.5869L50.6749 14.992L50.0749 14.2L50.3869 13.48V5.128C49.8349 4.576 49.4749 3.808 49.1149 2.68L49.4509 2.368L50.8189 2.656H63.3949L64.2109 2.272H64.9549C65.4829 2.704 65.9629 3.832 66.2269 4.936L65.8669 5.2L64.4989 4.888H54.2269ZM46.6669 17.2L47.0269 16.84L48.9949 17.44H66.5149L67.4269 17.008H68.2909C68.8429 17.488 69.4189 18.664 69.7069 20.008L69.3229 20.296L67.7389 19.936H50.0029L49.4029 20.272H48.5149C47.6269 19.528 47.1469 18.736 46.6669 17.2Z"
                fill="white"
              />
              <path
                d="M33.4974 4.216L32.9454 3.112L33.3534 2.392C34.7214 2.992 36.3294 3.4 37.5294 3.424L37.6494 4.144C37.2414 4.84 36.8094 5.536 36.3534 6.208L44.0574 10.984C43.8414 12.424 42.6654 14.224 41.4654 14.872L40.6014 14.392L40.6974 13.48L34.7454 8.536C33.0414 10.864 31.1454 12.952 29.1774 14.632C27.6894 14.752 26.2254 14.344 25.4094 13.576L25.5534 12.952L26.2734 12.544C29.5134 9.688 32.1054 6.592 33.4974 4.216ZM23.3934 17.08L23.7534 16.72L25.7214 17.32H43.2414L44.1534 16.888H45.0174C45.5694 17.368 46.1454 18.544 46.4334 19.888L46.0494 20.176L44.4654 19.816H26.7294L26.1294 20.152H25.2414C24.3534 19.408 23.8734 18.616 23.3934 17.08Z"
                fill="white"
              />
              <path
                d="M1.15199 2.68L2.92799 3.208H10.656L11.496 2.824H12.264C12.984 3.28 13.44 3.976 13.656 4.96L13.2 5.632L12.792 9.04C13.2 9.592 13.512 10.408 13.56 11.128L13.2 11.392L11.784 11.08H5.56799V14.992H12.048L12.888 14.608H13.656C14.16 15.04 14.712 16.168 14.952 17.32L14.592 17.584L13.176 17.272H3.11999L2.18399 17.584L1.55999 16.768L1.89599 16.048V10.96C1.31999 10.432 1.05599 9.88 0.959994 8.992L1.29599 8.68L2.95199 9.016H9.24L9.50399 5.416H3.83999L3.28799 5.704H2.49599C1.65599 5.032 1.22399 4.288 0.815994 2.992L1.15199 2.68ZM15.192 1.192L15.6 0.496002C16.488 0.928002 18.168 1.192 19.872 1.192L19.992 1.912L19.704 2.968V9.328H20.352L21.192 8.944H21.96C22.488 9.4 23.016 10.408 23.256 11.512L22.896 11.776L21.48 11.464H19.704V20.296L19.992 20.776C19.536 21.496 17.688 22.48 16.296 22.792L15.672 21.976L16.008 21.256V2.296L15.192 1.192Z"
                fill="white"
              />
            </svg>
            <span>라스트워 가이드북</span>
          </Anchor>
          <a href="https://lawarq.vercel.app">
            <span>게임 만들기</span>
          </a>
          <Anchor href="/daerogi">
            <span>.</span>
          </Anchor>
        </h1>
        <div className={`${styles.group} ${eventsJekyll ? styles.show : ''}`}>
          {!eventsJekyll && <h3>이벤트를 닫았어요.</h3>}
          <Events />
          <EventsIngame />
          <div className={styles.button}>
            <button type="button" onClick={() => setEventsJekyll((prev) => !prev)}>
              {eventsJekyll ? '이벤트 숨기기' : '이벤트 보기'}
            </button>
          </div>
        </div>
        <div className={styles['font-controller']}>
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
      </header>
      {router.pathname !== '/' && (
        <nav className={styles.gnb}>
          <ol ref={menuRef} className={styles.menu}>
            <li
              className={router.pathname === '/themes' ? styles.current : undefined}
              onClick={() => handleMenuClick('/themes', 0)}
            >
              <Anchor href="/themes">
                <span>오늘의 테마</span>
              </Anchor>
            </li>
            <li
              className={router.pathname === '/arms' ? styles.current : undefined}
              onClick={() => handleMenuClick('/arms', 1)}
            >
              <Anchor href="/arms">
                <span>군비 경쟁</span>
              </Anchor>
            </li>
            <li
              className={router.pathname === '/showdown' ? styles.current : undefined}
              onClick={() => handleMenuClick('/showdown', 2)}
            >
              <Anchor href="/showdown">
                <span>오늘의 군비 경쟁</span>
              </Anchor>
            </li>
            <li
              className={router.pathname === '/base' ? styles.current : undefined}
              onClick={() => handleMenuClick('/base', 3)}
            >
              <Anchor href="/base">
                <span>기지 레벨업</span>
              </Anchor>
            </li>
          </ol>
        </nav>
      )}
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Anchor from '../Anchor';
import { LawarItem } from '@/pages/daerogi';
import { componentMap } from '@/pages/daerogi/toolboxes/[toolboxId]';
import styles from '@/styles/Daerogi.module.sass';

export default function DaerogiHeader() {
  const router = useRouter();
  const menuRef = useRef<HTMLOListElement>(null);
  const [fontSize, setFontSize] = useState<number>(16);
  const [matching, setMatching] = useState<LawarItem[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/matching`);
      const result = await response.json();

      const formattedData: LawarItem[] = result.data.map((item: any) => ({
        id: item.id,
        subject: item.subject,
      }));

      setMatching(formattedData);
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <header className={styles.header}>
        <h1>
          <Anchor href="/daerogi">
            <svg width="142" height="24" viewBox="0 0 142 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M122.804 3.31695L124.46 3.60494H132.812L133.7 3.22094H134.516C135.308 3.62894 135.86 4.44494 135.98 5.38094L135.38 6.00494C132.956 10.6609 129.5 14.8849 125.156 17.9809C123.884 17.7649 122.42 17.0449 121.796 16.1329L122.084 15.5809L122.852 15.3889C126.38 12.7489 129.548 8.95694 131.108 6.00494H125.516L124.94 6.29294H124.1C123.26 5.52494 122.78 4.73295 122.468 3.62895L122.804 3.31695ZM137.18 1.58894L137.588 0.892944C138.5 1.32494 140.108 1.58894 141.764 1.58894L141.884 2.30894L141.596 3.36494V20.6929L141.884 21.1729C141.404 21.9169 139.628 22.9009 138.284 23.1889L137.66 22.3729L137.996 21.6529V2.69294L137.18 1.58894Z"
                fill="white"
              />
              <path
                d="M98.3544 17.6689L100.13 18.1969H107.618V14.5969H103.178L102.242 14.9089L101.618 14.0929L101.954 13.3729V9.72491C101.378 9.19691 101.114 8.64491 101.018 7.75691L101.354 7.44491L103.01 7.78091H112.97L113.234 5.14091H103.898L103.346 5.42891H102.554C101.714 4.75691 101.282 4.01291 100.874 2.71691L101.21 2.40491L102.986 2.93291H114.554L115.394 2.54891H116.162C116.882 3.00491 117.338 3.70091 117.554 4.68491L117.098 5.35691L116.69 7.80491C117.098 8.35691 117.41 9.17291 117.458 9.89291L117.098 10.1569L115.682 9.84491H105.794V12.3169H115.466L116.306 11.9329H117.074C117.578 12.3649 118.13 13.4929 118.37 14.6449L118.01 14.9089L116.594 14.5969H111.458V18.1969H118.154L118.994 17.8129H119.762C120.266 18.2449 120.794 19.3489 121.058 20.5249L120.698 20.7889L119.282 20.4769H101.042L100.49 20.7649H99.6984C98.8824 20.0929 98.4504 19.3729 98.0184 17.9809L98.3544 17.6689Z"
                fill="white"
              />
              <path
                d="M92.745 2.50094L92.001 1.51694L92.385 0.892944C93.249 1.27694 94.857 1.51694 96.297 1.51694L96.417 2.16494L96.153 3.10094V20.9569L96.417 21.3889C95.961 22.0369 94.209 22.9249 93.009 23.1889L92.433 22.4689L92.745 21.8209V11.7169H91.041V19.7569L91.305 20.1889C90.849 20.8369 89.145 21.7249 87.945 21.9889L87.369 21.2689L87.681 20.6209V3.02894L86.937 2.04494L87.321 1.42095C88.185 1.80494 89.745 2.04494 91.185 2.04494L91.305 2.69294L91.041 3.62895V9.48494H92.745V2.50094ZM75.393 4.34894L75.729 4.03694L77.145 4.32494H83.337L84.177 3.94094H84.945C85.497 4.39694 85.977 5.33294 86.241 6.41294L85.881 6.67694L84.465 6.36494H80.313V14.9809H84.129L84.969 14.5969H85.737C86.289 15.0529 86.793 16.0609 87.033 17.1649L86.673 17.4289L85.257 17.1169H77.937L77.001 17.4289L76.377 16.6129L76.713 15.8929V6.60494C76.041 5.98094 75.705 5.38094 75.393 4.34894Z"
                fill="white"
              />
              <path
                d="M54.2269 5.28495V7.82895H62.8429L63.6109 7.46895H64.3309C64.8109 7.87695 65.2669 8.95695 65.5309 10.0129L65.1949 10.2529L63.8749 9.96495H54.2269V12.7489H64.1869L64.9789 12.3649H65.7469C66.2269 12.7969 66.7309 13.9729 66.9949 15.1249L66.6349 15.3889L65.2669 15.0769H51.5869L50.6749 15.3889L50.0749 14.5969L50.3869 13.8769V5.52495C49.8349 4.97295 49.4749 4.20495 49.1149 3.07695L49.4509 2.76495L50.8189 3.05294H63.3949L64.2109 2.66895H64.9549C65.4829 3.10095 65.9629 4.22894 66.2269 5.33294L65.8669 5.59694L64.4989 5.28495H54.2269ZM46.6669 17.5969L47.0269 17.2369L48.9949 17.8369H66.5149L67.4269 17.4049H68.2909C68.8429 17.8849 69.4189 19.0609 69.7069 20.4049L69.3229 20.6929L67.7389 20.3329H50.0029L49.4029 20.6689H48.5149C47.6269 19.9249 47.1469 19.1329 46.6669 17.5969Z"
                fill="white"
              />
              <path
                d="M33.4974 4.61294L32.9454 3.50894L33.3534 2.78894C34.7214 3.38894 36.3294 3.79694 37.5294 3.82094L37.6494 4.54094C37.2414 5.23694 36.8094 5.93294 36.3534 6.60494L44.0574 11.3809C43.8414 12.8209 42.6654 14.6209 41.4654 15.2689L40.6014 14.7889L40.6974 13.8769L34.7454 8.93294C33.0414 11.2609 31.1454 13.3489 29.1774 15.0289C27.6894 15.1489 26.2254 14.7409 25.4094 13.9729L25.5534 13.3489L26.2734 12.9409C29.5134 10.0849 32.1054 6.98894 33.4974 4.61294ZM23.3934 17.4769L23.7534 17.1169L25.7214 17.7169H43.2414L44.1534 17.2849H45.0174C45.5694 17.7649 46.1454 18.9409 46.4334 20.2849L46.0494 20.5729L44.4654 20.2129H26.7294L26.1294 20.5489H25.2414C24.3534 19.8049 23.8734 19.0129 23.3934 17.4769Z"
                fill="white"
              />
              <path
                d="M1.152 3.07695L2.928 3.60494H10.656L11.496 3.22094H12.264C12.984 3.67694 13.44 4.37294 13.656 5.35694L13.2 6.02894L12.792 9.43694C13.2 9.98894 13.512 10.8049 13.56 11.5249L13.2 11.7889L11.784 11.4769H5.568V15.3889H12.048L12.888 15.0049H13.656C14.16 15.4369 14.712 16.5649 14.952 17.7169L14.592 17.9809L13.176 17.6689H3.12L2.184 17.9809L1.56 17.1649L1.896 16.4449V11.3569C1.32 10.8289 1.056 10.2769 0.960002 9.38894L1.296 9.07695L2.952 9.41294H9.24L9.504 5.81294H3.84L3.288 6.10094H2.496C1.656 5.42894 1.224 4.68494 0.816002 3.38894L1.152 3.07695ZM15.192 1.58894L15.6 0.892944C16.488 1.32494 18.168 1.58894 19.872 1.58894L19.992 2.30894L19.704 3.36494V9.72494H20.352L21.192 9.34095H21.96C22.488 9.79695 23.016 10.8049 23.256 11.9089L22.896 12.1729L21.48 11.8609H19.704V20.6929L19.992 21.1729C19.536 21.8929 17.688 22.8769 16.296 23.1889L15.672 22.3729L16.008 21.6529V2.69294L15.192 1.58894Z"
                fill="white"
              />
            </svg>
            <span>라스트 대로기</span>
          </Anchor>
          <Anchor href="/">
            <strong>가이드북 이동</strong>
          </Anchor>
        </h1>
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
      {!loading && !error && matching && router.pathname === '/daerogi/matching/[matchingId]' && (
        <nav className={styles.gnb}>
          <ol ref={menuRef} className={styles.menu}>
            {matching.map((item: LawarItem, index: number) => (
              <li
                key={index}
                className={router.asPath === `/daerogi/matching/${item.id}` ? styles.current : undefined}
                onClick={() => handleMenuClick(`/daerogi/matching/${item.id}`, index)}
              >
                <Anchor href={`/daerogi/matching/${item.id}`}>
                  <span>{item.subject}</span>
                </Anchor>
              </li>
            ))}
          </ol>
        </nav>
      )}
      {router.pathname === '/daerogi/toolboxes/[toolboxId]' && (
        <nav className={styles.gnb}>
          <ol ref={menuRef} className={styles.menu}>
            {Object.keys(componentMap).map((toolboxId, index) => {
              const { title } = componentMap[toolboxId];
              return (
                <li
                  key={toolboxId}
                  className={router.asPath === `/daerogi/toolboxes/${toolboxId}` ? styles.current : undefined}
                  onClick={() => handleMenuClick(`/daerogi/toolboxes/${toolboxId}`, index)}
                >
                  <Anchor href={`/daerogi/toolboxes/${toolboxId}`}>
                    <span>{title}</span>
                  </Anchor>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </>
  );
}

import { useRef } from 'react';
import { useRouter } from 'next/router';
import Anchor from './Anchor';
import Events from './Events';
import styles from '@/styles/Header.module.sass';

export default function Header() {
  const router = useRouter();
  const menuRef = useRef<HTMLOListElement>(null);

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

  return (
    <header className={styles.header}>
      <div className={styles.headline}>
        <h1>라스트워 가이드북</h1>
        <Events />
      </div>
      {router.pathname !== '/' && (
        <nav>
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
              onClick={() => handleMenuClick('/base', 1)}
            >
              <Anchor href="/base">
                <span>기지 레벨업</span>
              </Anchor>
            </li>
          </ol>
        </nav>
      )}
    </header>
  );
}

import React, { useEffect, useState } from 'react';

export default function ToggleMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => {
    const htmlElement = document.documentElement;

    if (menuOpen) {
      htmlElement.removeAttribute('data-html');
    } else {
      htmlElement.setAttribute('data-html', 'true');
    }

    setMenuOpen(!menuOpen);
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY >= 72 && currentScrollY >= lastScrollY) {
      setTimeout(() => setIsVisible(true), 270);
      setIsMounted(false);
    } else if (currentScrollY < 72 && currentScrollY < lastScrollY) {
      setIsVisible(false);
      setTimeout(() => setIsMounted(true), 270);
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    !isMounted && (
      <button
        type="button"
        className={isVisible ? 'toggle-menu show' : 'x hide'}
        aria-label="메뉴"
        aria-expanded={menuOpen ? 'true' : 'false'}
        aria-controls={menuOpen ? 'navigation' : undefined}
        onClick={toggleMenu}
      >
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect opacity="0.01" x="4" y="4" width="22" height="22" fill="black" />
          <rect opacity="0.01" x="3" y="3" width="24" height="24" fill="black" />
          <rect x="5" y="8" width="20" height="2" rx="1" fill="black" />
          <rect x="5" y="14" width="20" height="2" rx="1" fill="black" />
          <rect x="5" y="20" width="20" height="2" rx="1" fill="black" />
        </svg>
      </button>
    )
  );
}

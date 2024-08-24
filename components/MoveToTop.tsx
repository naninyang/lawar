import React, { useEffect, useState } from 'react';

export default function MoveToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    !isMounted && (
      <button type="button" onClick={scrollToTop} className={isVisible ? 'move-to-top show' : 'move-to-top hide'}>
        🔝
      </button>
    )
  );
}

import React, { useEffect, useState } from 'react';

export default function MoveToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      if (!isMounted) {
        setIsVisible(true);
      } else {
        setIsMounted(true);
        setTimeout(() => setIsVisible(true), 0);
      }
    } else {
      setIsVisible(false);
      setTimeout(() => setIsMounted(false), 270);
    }
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
  }, []);

  return (
    !isMounted && (
      <button type="button" onClick={scrollToTop} className={isVisible ? 'move-to-top show' : 'move-to-top'}>
        🔝
      </button>
    )
  );
}

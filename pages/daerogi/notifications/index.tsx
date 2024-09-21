import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Notification from '@/components/daerogi/Notification';

export default function Notifications() {
  const router = useRouter();

  useEffect(() => {
    const authInLocalStorage = localStorage.getItem('auth');
    const authInCookies = document.cookie.includes('auth=');

    if (authInLocalStorage && !authInCookies) {
      document.cookie = `auth=${authInLocalStorage}; path=/;`;
    } else if (!authInLocalStorage && !authInCookies) {
      router.push('/daerogi/login');
    }
  }, [router]);
  return <Notification />;
}

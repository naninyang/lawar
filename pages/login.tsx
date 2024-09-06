import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Daerogi.module.sass';

export default function Login() {
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authInLocalStorage = localStorage.getItem('auth');
    const authInCookies = document.cookie.includes('auth=');

    if (authInLocalStorage && !authInCookies) {
      document.cookie = `auth=${authInLocalStorage}; path=/;`;
      router.push('/daerogi');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      const { hashedValue } = await response.json();
      localStorage.setItem('auth', hashedValue);
      document.cookie = `auth=${hashedValue}; path=/`;
      router.push('/daerogi');
    } else {
      const data = await response.json();
      setError(data.message);
    }
  };

  return (
    <main className={styles.login}>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>로그인 폼</legend>
          <input type="hidden" name="username" value="daerogi" />
          <p>
            <label htmlFor="pwd">비밀번호는 아리에게 물어보세요</label>
          </p>
          <div className={styles.group}>
            <label htmlFor="pwd">비밀번호</label>
            <div className={styles.pwd}>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <div className={styles.button}>
            <button type="submit">
              입장하기
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14 4.92969L12.5 6.42969L17.0703 11H3V13H17.0703L12.5 17.5703L14 19.0703L21.0703 12L14 4.92969Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
          {error && <p>{error}</p>}
        </fieldset>
      </form>
    </main>
  );
}

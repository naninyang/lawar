import Anchor from '@/components/Anchor';
import Seo from '@/components/Seo';
import styles from '@/styles/Error.module.sass';

export default function Custom500() {
  const timestamp = Date.now();
  const handleRefresh = () => {
    window.location.reload();
  };
  return (
    <main className={styles.error}>
      <Seo
        pageTitle="라스트워 가이드북"
        pageDescription="즐거운 라스트워 :)"
        pageImg={`https://lawar.dev1stud.io/og?ts=${timestamp}`}
      />
      <h2>Oops! 일시적인 오류</h2>
      <p>
        <button type="button" onClick={handleRefresh}>
          새로고침{' '}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 0L8 4L12 8V5C15.859 5 19 8.14 19 12C19 12.88 18.8293 13.7201 18.5312 14.4961L20.0469 16.0098C20.6519 14.8008 21 13.442 21 12C21 7.038 16.963 3 12 3V0ZM3.95312 7.99023C3.34812 9.19923 3 10.558 3 12C3 16.962 7.037 21 12 21V24L16 20L12 16V19C8.141 19 5 15.86 5 12C5 11.12 5.17075 10.2799 5.46875 9.50391L3.95312 7.99023Z"
              fill="white"
            />
          </svg>
        </button>
        <Anchor href="/">
          Going Home{' '}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14 4.92969L12.5 6.42969L17.0703 11H3V13H17.0703L12.5 17.5703L14 19.0703L21.0703 12L14 4.92969Z"
              fill="white"
            />
          </svg>
        </Anchor>
      </p>
      <div className={styles.YouTube}>
        <div>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/W5x7a0L4P_M?si=BO4bgYdPR8_5omEI"
            title="유튜브 뮤직 플레이어"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
        <div>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/gR4_uoJdOr0?si=lFOuGTrNQM4JGB2K"
            title="유튜브 뮤직 플레이어"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </main>
  );
}

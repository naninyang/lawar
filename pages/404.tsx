import Anchor from '@/components/Anchor';
import Seo from '@/components/Seo';
import styles from '@/styles/Error.module.sass';

export default function Custom404() {
  const timestamp = Date.now();
  return (
    <main className={styles.error}>
      <Seo
        pageTitle="라스트워 가이드북"
        pageDescription="즐거운 라스트워 :)"
        pageImg={`https://lawar.dev1stud.io/og?ts=${timestamp}`}
      />
      <h2>언니, 오라버니들 길을 잃었나요?</h2>
      <p>
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
    </main>
  );
}

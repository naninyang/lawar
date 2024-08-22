import Anchor from '@/components/Anchor';
import Seo from '@/components/Seo';
import styles from '@/styles/Home.module.sass';

export default function Home() {
  const timestamp = Date.now();
  return (
    <main className={styles.home}>
      <Seo
        pageTitle="라스트워 가이드북"
        pageDescription="즐거운 라스트워 :)"
        pageImg={`https://lawar.dev1stud.io/og?ts=${timestamp}`}
      />
      <p>원하는 정보를 선택하세요 :)</p>
      <ul>
        <li>
          <Anchor href="/themes">
            <span>오늘의 테마</span>
          </Anchor>
        </li>
        <li>
          <Anchor href="/arms">
            <span>군비 경쟁</span>
          </Anchor>
        </li>
        {/* <li>
          <Anchor href="/showdown">
            <span>테마 + 군비</span>
          </Anchor>
        </li> */}
        <li>
          <Anchor href="/base">
            <span>기지 레벨업</span>
          </Anchor>
        </li>
      </ul>
    </main>
  );
}

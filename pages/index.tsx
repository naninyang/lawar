import Anchor from '@/components/Anchor';
import CurrentArms from '@/components/current/CurrentArms';
import CurrentShowdown from '@/components/current/CurrentShowdown';
import CurrentTheme from '@/components/current/CurrentThemes';
import SearchBase from '@/components/current/SearchBase';
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
          <div className={styles.item}>
            <Anchor href="/themes">
              <span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 2L3 6L9.45703 12.0781L7.04688 14.6367L6.20703 13.793L4.79297 15.207L5.67969 16.0938L3.17187 18.7539L2.70703 18.293L1.29297 19.707L4.29297 22.707L5.70703 21.293L5.24219 20.8281L7.90625 18.3242L8.79297 19.207L10.207 17.793L9.36719 16.9531L12 14.4688L14.625 16.9414L13.7734 17.793L15.1875 19.207L16.082 18.3125L18.7461 20.8164L18.2695 21.293L19.6875 22.707L22.6875 19.707L21.2734 18.293L20.8203 18.7461L18.3125 16.082L19.1875 15.207L17.7734 13.793L16.9414 14.625L14.543 12.0781L14.5469 12.0742L12 9.375L6 3L2 2ZM22 2L18 3L13.1523 8.14844L15.8477 10.8477L21 6L22 2Z"
                    fill="white"
                  />
                </svg>
                <span>오늘의 테마</span>
              </span>
              <strong>
                <span>더보기</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 4.92969L12.5 6.42969L17.0703 11H3V13H17.0703L12.5 17.5703L14 19.0703L21.0703 12L14 4.92969Z"
                    fill="white"
                  />
                </svg>
              </strong>
            </Anchor>
            <CurrentTheme />
          </div>
        </li>
        <li>
          <div className={styles.item}>
            <Anchor href="/arms">
              <span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22 2L16.6992 2.80078L18.2422 4.34375L15.1777 7.4082L13.5684 5.90039L9.49219 10.0781L8.00781 8.59375L3.30273 13.2031L4.70312 14.6309L7.99219 11.4062L9.50781 12.9219L13.6309 8.69922L15.2227 10.1914L19.6562 5.75781L21.1992 7.30078L22 2ZM19 10V21H21V10H19ZM15 12V21H17V12H15ZM11 14V21H13V14H11ZM7 16V21H9V16H7ZM3 18V21H5V18H3Z"
                    fill="white"
                  />
                </svg>
                <span>군비 경쟁</span>
              </span>
              <strong>
                <span>더보기</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 4.92969L12.5 6.42969L17.0703 11H3V13H17.0703L12.5 17.5703L14 19.0703L21.0703 12L14 4.92969Z"
                    fill="white"
                  />
                </svg>
              </strong>
            </Anchor>
            <CurrentArms />
          </div>
        </li>
        <li>
          <div className={styles.item}>
            <Anchor href="/showdown">
              <span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.58594 3L9.29297 3.29297L7 5.58594V8H5.69922L2 10.4609V12H22V10.4609L18.3008 8H17V6H22V4H15.4141L14.4141 3H9.58594ZM10.4141 5H13.5859L15 6.41406V8H9V6.41406L10.4141 5ZM2 14V14.1895L3.07031 16.8594C3.83031 18.7694 5.65094 20 7.71094 20H15.7305C17.4845 20 19.1116 19.0811 20.0156 17.5781L22 14.2793V14H2ZM8 16C8.55 16 9 16.45 9 17C9 17.55 8.55 18 8 18C7.45 18 7 17.55 7 17C7 16.45 7.45 16 8 16ZM12 16C12.55 16 13 16.45 13 17C13 17.55 12.55 18 12 18C11.45 18 11 17.55 11 17C11 16.45 11.45 16 12 16ZM16 16C16.55 16 17 16.45 17 17C17 17.55 16.55 18 16 18C15.45 18 15 17.55 15 17C15 16.45 15.45 16 16 16Z"
                    fill="white"
                  />
                </svg>
                <span>오늘의 군비 경쟁</span>
              </span>
              <strong>
                <span>더보기</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 4.92969L12.5 6.42969L17.0703 11H3V13H17.0703L12.5 17.5703L14 19.0703L21.0703 12L14 4.92969Z"
                    fill="white"
                  />
                </svg>
              </strong>
            </Anchor>
            <CurrentShowdown />
          </div>
        </li>
        <li>
          <div className={styles.item}>
            <Anchor href="/base">
              <span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 4L3 10V14L12 8L21 14V10L12 4ZM12 10.375L3 16.375V20.375L12 14.375L21 20.375V16.375L12 10.375Z"
                    fill="white"
                  />
                </svg>
                <span>기지 레벨업</span>
              </span>
              <strong>
                <span>더보기</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 4.92969L12.5 6.42969L17.0703 11H3V13H17.0703L12.5 17.5703L14 19.0703L21.0703 12L14 4.92969Z"
                    fill="white"
                  />
                </svg>
              </strong>
            </Anchor>
            <SearchBase />
          </div>
        </li>
      </ul>
    </main>
  );
}

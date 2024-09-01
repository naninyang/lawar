import styles from '@/styles/Footer.module.sass';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; 고아리 & 라스트워 482서버 ycl 연맹</p>
      <ul>
        <li>
          개발 & 디자인: 라스트워 482 [ycl] <strong>클로에</strong> ([N1W] <strong>빛이나</strong>)
        </li>
        <li>본 웹사이트는 482서버 ycl 연맹과 N1W 일부 연맹원이 사용할 목적으로 제작되었습니다.</li>
        <li>
          본 웹사이트는 타 서버 또는 타 연맹의 맹원들도 이용이 가능하나, 시간대 테스트를 진행하지 않았으므로 KST
          시간대가 아닌 디바이스에서는 정상적인 동작을 보장하지 않습니다.
        </li>
        <li>한국어 외 다른 언어는 지원할 예정이 없습니다.</li>
      </ul>
    </footer>
  );
}

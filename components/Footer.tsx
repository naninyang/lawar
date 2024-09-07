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
        <li>서버마다 군비 시간이 다르므로 이용에 유의하시기 바랍니다.</li>
        <li>482서버 유저라 할지라도 KST 시간대가 아니라면 현재 시간에 오차가 생길 수 있습니다.</li>
        <li>한국어 외 다른 언어는 지원할 예정이 없습니다.</li>
      </ul>
    </footer>
  );
}

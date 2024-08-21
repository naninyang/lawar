import styles from '@/styles/Footer.module.sass';
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <ul>
        <li>본 웹사이트는 482서버 ycl 연맹 클로에(본캐 N1W 연맹 빛이나)가 만든 웹사이트입니다.</li>
        <li>본 웹사이트는 482서버 ycl 연맹에서 사용할 목적으로 제작되었습니다.</li>
        <li>
          본 웹사이트는 타 서버 또는 타 연맹의 맹원들도 이용이 가능하나, KST 시간대가 아닌 디바이스에서는 일부 기능이
          오작동 할 수 있습니다.
        </li>
      </ul>
    </footer>
  );
}

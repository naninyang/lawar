import styles from '@/styles/Daerogi.module.sass';

export default function DaerogiFooter() {
  return (
    <footer className={styles.footer}>
      <p>&copy; 고아리 & 라스트 대로기</p>
      <ul>
        <li>비밀번호는 라스트 대로기 내부에서만 사용하는 비밀번호이기 때문에 외부에 공유해서는 절대! 안됩니다.</li>
      </ul>
    </footer>
  );
}

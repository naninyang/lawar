import { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Anchor from '@/components/Anchor';
import styles from '@/styles/Daerogi.module.sass';

export type ManagementMap = {
  [key: string]: {
    name: string;
    title: string;
    content: React.ComponentType<any>;
  };
};

export const managementMap: ManagementMap = {
  members: {
    name: 'members',
    title: '슬랙 멤버 관리',
    content: dynamic(() => import('@/components/toolboxes/Members')),
  },
  notice: {
    name: 'notice',
    title: '이벤트 공지',
    content: dynamic(() => import('@/components/toolboxes/Notice')),
  },
  // now: {
  //   name: 'now',
  //   title: '급한 알람',
  //   content: dynamic(() => import('@/components/daerogi/Now')),
  // },
  events: {
    name: 'events',
    title: '사막전 외 이벤트',
    content: dynamic(() => import('@/components/toolboxes/Events')),
  },
};

interface Props {
  managementId: string;
}

export default function Management({ managementId }: Props) {
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

  const managementInfo = managementMap[managementId];
  if (!managementInfo) return;
  const { title, content: Component } = managementInfo;

  return (
    <main className={styles.util}>
      {managementInfo && (
        <>
          <h1>{title}</h1>
          <Component />
          <div className={styles.backbutton}>
            <Anchor href="/daerogi">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10 19.0703L11.5 17.5703L6.92969 13L21 13L21 11L6.92969 11L11.5 6.42969L10 4.92969L2.92969 12L10 19.0703Z"
                  fill="white"
                />
              </svg>
              <span>뒤로가기</span>
            </Anchor>
          </div>
        </>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const managementId = params?.managementId;

  return {
    props: { managementId },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

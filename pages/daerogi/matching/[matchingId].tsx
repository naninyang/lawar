import { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Anchor from '@/components/Anchor';
import styles from '@/styles/Daerogi.module.sass';

interface MatchingItem {
  id: number;
  subject: string;
  content: any[];
}

interface MatchingDetailPage {
  matchingItem: MatchingItem;
}

export default function MatchingDetail({ matchingItem }: MatchingDetailPage) {
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

  const renderContent = (block: any, index: number) => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
        return <HeadingTag key={index}>{block.children[0].text}</HeadingTag>;

      case 'list':
        const ListTag = block.format === 'unordered' ? 'ul' : 'ol';
        return (
          <ListTag key={index}>
            {block.children.map((item: any, idx: number) => (
              <li key={idx}>
                {item.children.map((child: any, childIdx: number) => (
                  <span key={childIdx}>{child.bold ? <strong>{child.text}</strong> : child.text}</span>
                ))}
              </li>
            ))}
          </ListTag>
        );
      default:
        return null;
    }
  };

  return (
    <main className={styles.detail}>
      {router.isFallback ? (
        <p>데이터를 불러오는 중입니다 :)</p>
      ) : (
        <article>
          <h1>{matchingItem.subject}</h1>
          <div className={styles.content}>
            {matchingItem.content.map((block, index) => renderContent(block, index))}
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
          </div>
        </article>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const matchingId = params?.matchingId;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/matching?id=${matchingId}`);
  const result = await response.json();
  console.log('result: ', result);

  const matchingItem = {
    id: result.data.id,
    documentId: result.data.documentId,
    subject: result.data.subject,
    content: result.data.content,
  };

  return {
    props: {
      matchingItem,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

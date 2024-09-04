import { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import bcrypt from 'bcryptjs';
import styles from '@/styles/Daerogi.module.sass';

interface DaerogiItem {
  id: number;
  subject: string;
  content: any[];
}

interface DaerogiDetailPage {
  daerogiItem: DaerogiItem;
}

export default function DaerogiDetail({ daerogiItem }: DaerogiDetailPage) {
  const router = useRouter();

  useEffect(() => {
    const authInLocalStorage = localStorage.getItem('auth');
    const authInCookies = document.cookie.includes('auth=');

    if (authInLocalStorage && authInCookies) {
      const authCookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth='))
        ?.split('=')[1];

      if (authCookieValue) {
        bcrypt.compare(authInLocalStorage, authCookieValue).then((isValid) => {
          if (isValid) {
            router.push('/daerogi');
          }
        });
      }
    } else {
      router.push('/login');
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

  const handleBackClick = () => {
    router.back();
  };

  return (
    <main className={styles.detail}>
      {router.isFallback ? (
        <p>데이터를 불러오는 중입니다 :)</p>
      ) : (
        <article>
          <h1>{daerogiItem.subject}</h1>
          <div className={styles.content}>
            {daerogiItem.content.map((block, index) => renderContent(block, index))}
            <div className={styles.backbutton}>
              <button type="button" onClick={handleBackClick}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 19.0703L11.5 17.5703L6.92969 13L21 13L21 11L6.92969 11L11.5 6.42969L10 4.92969L2.92969 12L10 19.0703Z"
                    fill="white"
                  />
                </svg>
                <span>뒤로가기</span>
              </button>
            </div>
          </div>
        </article>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const daerogiId = params?.daerogiId;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/daerogi?id=${daerogiId}`);
  const result = await response.json();

  const daerogiItem = {
    id: result.data.id,
    subject: result.data.attributes.subject,
    content: result.data.attributes.content,
  };

  return {
    props: {
      daerogiItem,
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

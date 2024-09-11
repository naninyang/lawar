import { GetStaticPaths, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Anchor from '@/components/Anchor';
import styles from '@/styles/Daerogi.module.sass';

export type ComponentMap = {
  [key: string]: {
    name: string;
    title: string;
    content: React.ComponentType<any>;
  };
};

export const componentMap: ComponentMap = {
  unit: {
    name: 'unit',
    title: '단위 계산기',
    content: dynamic(() => import('@/components/daerogi/Unit')),
  },
  alliance: {
    name: 'alliance',
    title: '연맹대전 보상 계산기',
    content: dynamic(() => import('@/components/daerogi/Alliance')),
  },
};

interface Props {
  toolboxId: string;
}

export default function Toolbox({ toolboxId }: Props) {
  const componentInfo = componentMap[toolboxId];
  if (!componentInfo) return;
  const { title, content: Component } = componentInfo;

  return (
    <main className={styles.util}>
      {componentInfo && (
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
  const toolboxId = params?.toolboxId;

  return {
    props: { toolboxId },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

import { GetStaticPaths, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Seo, { originTitle } from '@/components/Seo';
import styles from '@/styles/Toolboxes.module.sass';

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
    title: '연맹대전 계산기',
    content: dynamic(() => import('@/components/daerogi/Alliance')),
  },
  arms: {
    name: 'arms',
    title: '군비 보상 계산기',
    content: dynamic(() => import('@/components/daerogi/Arms')),
  },
};

interface Props {
  toolboxId: string;
}

export default function Toolbox({ toolboxId }: Props) {
  const componentInfo = componentMap[toolboxId];
  if (!componentInfo) return;
  const { title, content: Component } = componentInfo;
  const timestamp = Date.now();
  return (
    <main className={styles.toolboxes}>
      <Seo
        pageTitles={`툴박스 - ${originTitle}`}
        pageTitle="툴박스"
        pageDescription="라스트워 여러가지 툴박스"
        pageImg={`https://lawar.dev1stud.io/og-toolboxes.webp?ts=${timestamp}`}
      />
      {componentInfo && (
        <>
          <h1>{title}</h1>
          <Component />
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

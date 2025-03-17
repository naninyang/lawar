import { GetStaticPaths, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Seo, { originTitle } from '@/components/Seo';
import styles from '@/styles/Toolboxes.module.sass';

export type ToolboxMap = {
  [key: string]: {
    name: string;
    title: string;
    content: React.ComponentType<any>;
  };
};

export const toolboxMap: ToolboxMap = {
  unit: {
    name: 'unit',
    title: '단위 계산기',
    content: dynamic(() => import('@/components/toolboxes/Unit')),
  },
  alliance: {
    name: 'alliance',
    title: '연맹대전 계산기',
    content: dynamic(() => import('@/components/toolboxes/Alliance')),
  },
  arms: {
    name: 'arms',
    title: '군비 보상 계산기',
    content: dynamic(() => import('@/components/toolboxes/Arms')),
  },
  exp: {
    name: 'exp',
    title: '영웅 경험치 계산기',
    content: dynamic(() => import('@/components/toolboxes/Exp')),
  },
  eq: {
    name: 'eq',
    title: '영웅 장비 계산기',
    content: dynamic(() => import('@/components/toolboxes/Eq')),
  },
};

interface Props {
  toolboxId: string;
}

export default function Toolbox({ toolboxId }: Props) {
  const componentInfo = toolboxMap[toolboxId];
  if (!componentInfo) return;
  const { name, title, content: Component } = componentInfo;
  const timestamp = Date.now();
  return (
    <main className={styles.toolboxes}>
      {componentInfo && (
        <>
          <Seo
            pageTitles={`${title} [툴박스] - ${originTitle}`}
            pageTitle={`툴박스 - ${title}`}
            pageDescription={`툴박스 - ${title}`}
            pageImg={`https://lawar.dev1stud.io/og-toolboxes-${name}.webp?ts=${timestamp}`}
          />
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

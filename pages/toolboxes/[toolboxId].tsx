import { GetStaticPaths, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
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

  return (
    <main className={styles.toolboxes}>
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

import { GetStaticPaths, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Seo, { originTitle } from '@/components/Seo';

export type GeneralMap = {
  [key: string]: {
    name: string;
    title: string;
    content: React.ComponentType<any>;
  };
};

export const generalMap: GeneralMap = {
  themes: {
    name: 'themes',
    title: '오늘의 테마',
    content: dynamic(() => import('@/components/general/Themes')),
  },
  arms: {
    name: 'arms',
    title: '군비 경쟁',
    content: dynamic(() => import('@/components/general/Arms')),
  },
  showdown: {
    name: 'showdown',
    title: '오늘의 군비 경쟁',
    content: dynamic(() => import('@/components/general/Showdown')),
  },
  base: {
    name: 'base',
    title: '기지 레벨업',
    content: dynamic(() => import('@/components/general/Base')),
  },
  drone: {
    name: 'drone',
    title: '드론 레벨업',
    content: dynamic(() => import('@/components/general/Drone')),
  },
};

interface Props {
  generalId: string;
}

export default function General({ generalId }: Props) {
  const componentInfo = generalMap[generalId];
  if (!componentInfo) return;
  const { name, title, content: Component } = componentInfo;
  const timestamp = Date.now();
  return (
    <>
      {componentInfo && (
        <>
          <Seo
            pageTitles={`${title} [기본정보] - ${originTitle}`}
            pageTitle={`기본정보 - ${title}`}
            pageDescription={`기본정보 - ${title}`}
            pageImg={`https://lawar.dev1stud.io/og-general-${name}.webp?ts=${timestamp}`}
          />
          <Component />
        </>
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const generalId = params?.generalId;

  return {
    props: { generalId },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

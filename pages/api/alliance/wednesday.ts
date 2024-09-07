import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    title: '3일차 테크 연구 (승차점수 2점)',
    rewards: [
      { item: '테크 가속 1분 사용', reward: 115 },
      { item: '테크 전투력 1점 증가', reward: 21 },
      { item: '명예 훈장 1개 소모', reward: 600 },
      { item: '레이더 임무 1회 완료', reward: 23000 },
      { item: '다이아 포함 패키지 구매 (1다이아)', reward: 30 },
      { item: '1레벨 드론 파츠 상자 개봉시', reward: 2200 },
      { item: '2레벨 드론 파츠 상자 개봉시', reward: 6600 },
      { item: '3레벨 드론 파츠 상자 개봉시', reward: 20000 },
      { item: '4레벨 드론 파츠 상자 개봉시', reward: 60000 },
      { item: '5레벨 드론 파츠 상자 개봉시', reward: 180000 },
      { item: '6레벨 드론 파츠 상자 개봉시', reward: 540000 },
      { item: '7레벨 드론 파츠 상자 개봉시', reward: 1620000 },
    ],
    items: [
      '테크 가속 1분 사용',
      '테크 전투력 증가',
      '명예 훈장 소모',
      '레이더 임무 완료',
      '다이아 포함 패키지 구매',
      '드론 파츠 상자 개봉',
    ],
  });
}

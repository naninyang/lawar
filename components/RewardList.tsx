import React from 'react';

const rewards: { [key: string]: { item: string; reward: string }[] } = {
  '영웅 증가': [
    { item: '정예 모집 1회', reward: '400' },
    { item: '한번에 최소 2,000점의 영웅 경험치 소모', reward: '1' },
    { item: '다이아 포함 패키지 구매 (1다이아)', reward: '30' },
  ],
  '도시 건설': [
    { item: '건물 전투력 1점 증가', reward: '1' },
    { item: '건설 가속 1분 사용', reward: '10' },
    { item: '다이아 포함 패키지 구매 (1다이아)', reward: '30' },
  ],
  '유닛 증가': [
    { item: '1레벨 유닛 1개 훈련', reward: '5' },
    { item: '2레벨 유닛 1개 훈련', reward: '6' },
    { item: '3레벨 유닛 1개 훈련', reward: '7' },
    { item: '4레벨 유닛 1개 훈련', reward: '13' },
    { item: '5레벨 유닛 1개 훈련', reward: '15' },
    { item: '6레벨 유닛 1개 훈련', reward: '19' },
    { item: '7레벨 유닛 1개 훈련', reward: '22' },
    { item: '8레벨 유닛 1개 훈련', reward: '25' },
    { item: '9레벨 유닛 1개 훈련', reward: '28' },
    { item: '10레벨 유닛 1개 훈련', reward: '31' },
    { item: '훈련 가속 1분 사용', reward: '10' },
    { item: '다이아 포함 패키지 구매 (1다이아)', reward: '30' },
  ],
  '테크 연구': [
    { item: '테크 전투력 1점 증가', reward: '1' },
    { item: '테크 가속 1분 사용', reward: '10' },
    { item: '다이아 포함 패키지 구매 (1다이아)', reward: '30' },
  ],
  '드론 강화': [
    { item: '드론 전투 데이터 사용 10점', reward: '1' },
    { item: '체력 1점 소모', reward: '100' },
    { item: '다이아 포함 패키지 구매 (1다이아)', reward: '30' },
  ],
};

interface RewardListProps {
  theme: string;
}

const RewardList: React.FC<RewardListProps> = ({ theme }) => {
  const currentRewards = rewards[theme] || [];

  return (
    <dl>
      {currentRewards.map((reward, index) => (
        <div key={index}>
          <dt>{reward.item}</dt>
          <dd>{reward.reward}</dd>
        </div>
      ))}
    </dl>
  );
};

export default RewardList;

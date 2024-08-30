export type Reward = {
  item: string;
  reward: number;
};

export type Theme = {
  title: string;
  rewards: Reward[];
};

export type Alliance = {
  title: string;
  rewards: Reward[];
};

export interface Themess {
  name: string;
  time: string;
  rewards: { item: string; reward: number }[];
}

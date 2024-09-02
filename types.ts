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

export interface Themes {
  name: string;
  time: string;
  rewards: { item: string; reward: number }[];
}

export interface LastEvents {
  type: string;
  summary: string;
  datetime: string;
  status?: string;
  remainingTime?: string;
  remainingMilliseconds?: number;
}

export type Reward = {
  item: string;
  reward: number;
};

export type Theme = {
  title: string;
  rewards: Reward[];
};

export type Alliance = {
  day: string;
  title: string;
  rewards: Reward[];
  items?: any;
};

export interface Themes {
  day: string;
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

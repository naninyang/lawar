import { atom } from 'recoil';

export const serverTimeState = atom<Date | null>({
  key: 'serverTimeState',
  default: null,
});

import { atom } from 'recoil';

export const serverTimeState = atom<Date | null>({
  key: 'serverTimeState',
  default: null,
});

export const koreanTimeState = atom<Date | null>({
  key: 'koreanTimeState;',
  default: null,
});

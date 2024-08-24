import { atom } from 'recoil';

export const serverTimeState = atom<Date | null>({
  key: 'serverTimeState',
  default: null,
});

export const serverTimezoneState = atom<string | null>({
  key: 'serverTimezoneState',
  default: null,
});

export const nowTimeState = atom<Date | null>({
  key: 'nowTimeState',
  default: null,
});

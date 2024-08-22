export const KST_OFFSET = 9 * 60;
export const THEME_INTERVAL = 4 * 60 * 60 * 1000;

export const themes = ['영웅 증가', '도시 건설', '유닛 증가', '테크 연구', '드론 강화'];

export function getKSTDate(): Date {
  const now = new Date();
  const utcNow = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utcNow + KST_OFFSET * 60 * 1000);
}

export function getWeekStartTime(): Date {
  const kstNow = getKSTDate();
  const dayOffset = (kstNow.getUTCDay() - 6 + 7) % 7;
  const startOfWeek = new Date(kstNow.getTime() - dayOffset * 24 * 60 * 60 * 1000);
  startOfWeek.setUTCHours(2, 0, 0, 0);
  return startOfWeek;
}

export function getCurrentThemeAndTime() {
  const startOfWeek = getWeekStartTime();
  const kstNow = getKSTDate();
  const timeElapsed = kstNow.getTime() - startOfWeek.getTime();
  const themeIndex = Math.floor(timeElapsed / THEME_INTERVAL) % themes.length;
  const nextThemeIndex = (themeIndex + 1) % themes.length;
  const nextThemeTime = startOfWeek.getTime() + (themeIndex + 1) * THEME_INTERVAL;
  const remainingTimeMs = Math.max(0, nextThemeTime - kstNow.getTime());

  const remainingHours = Math.floor(remainingTimeMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
  const remainingSeconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

  return {
    currentTheme: themes[themeIndex],
    nextTheme: themes[nextThemeIndex],
    remainingTime: {
      hours: remainingHours,
      minutes: remainingMinutes,
      seconds: remainingSeconds,
    },
  };
}

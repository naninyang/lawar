import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useMediaQuery } from 'react-responsive';
import ProgressBar from './ProgressBar';
import styles from '@/styles/Daerogi.module.sass';

interface Reward {
  item: string;
  reward: number;
}

interface ApiResponse {
  day: string;
  title: string;
  rewards: Reward[];
}

interface TitleOption {
  day: string;
  title: string;
  api: string;
}

const thresholds = [
  { count: 0, score: 0 },
  { count: 1, score: 40000 },
  { count: 2, score: 150000 },
  { count: 3, score: 540000 },
  { count: 4, score: 660000 },
  { count: 5, score: 1000000 },
  { count: 6, score: 2300000 },
  { count: 7, score: 2600000 },
  { count: 8, score: 3600000 },
  { count: 9, score: 7200000 },
];

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const mobile = useMediaQuery({
    query: `(max-width: ${991 / 16}rem)`,
  });
  useEffect(() => {
    setIsMobile(mobile);
  }, [mobile]);
  return isMobile;
}

export default function Alliance() {
  const [selectedAlliance, setSelectedAlliance] = useState<string>('');
  const [titles, setTitles] = useState<TitleOption[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [inputValues, setInputValues] = useState<{ [key: number]: number }>({});
  const [totalReward, setTotalReward] = useState<number>(0);
  const [chestCount, setChestCount] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const isMobile = useMobile();

  const apiList: string[] = [
    '/api/alliance/monday',
    '/api/alliance/tuesday',
    '/api/alliance/wednesday',
    '/api/alliance/thursday',
    '/api/alliance/friday',
    '/api/alliance/saturday',
    '/api/alliance/sunday',
  ];

  useEffect(() => {
    setIsMounted(true);

    async function fetchTitles() {
      const fetchedTitles: TitleOption[] = [];
      for (const api of apiList) {
        const response = await fetch(api);
        const data: ApiResponse = await response.json();
        fetchedTitles.push({ day: data.day, title: data.title, api });
      }
      setTitles(fetchedTitles);
    }

    fetchTitles();
  }, []);

  const handleTitleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedAlliance === '') return;

    const response = await fetch(selectedAlliance);
    const data: ApiResponse = await response.json();
    setRewards(data.rewards);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value) || 0;
    setInputValues((prevValues) => ({ ...prevValues, [index]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let total = 0;

    rewards.forEach((reward, index) => {
      const count = inputValues[index] || 0;
      total += count * reward.reward;
    });

    setTotalReward(total);
    calculateChestCount(total);
  };

  const getNextChestThreshold = (total: number): number => {
    if (total < 40000) return 40000;
    if (total < 150000) return 150000;
    if (total < 540000) return 540000;
    if (total < 660000) return 660000;
    if (total < 1000000) return 1000000;
    if (total < 2300000) return 2300000;
    if (total < 2600000) return 2600000;
    if (total < 3600000) return 3600000;
    if (total < 7200000) return 7200000;
    return 7200000;
  };

  const calculateChestCount = (total: number) => {
    if (total >= 7200000) setChestCount(9);
    else if (total >= 3600000) setChestCount(8);
    else if (total >= 2600000) setChestCount(7);
    else if (total >= 2300000) setChestCount(6);
    else if (total >= 1000000) setChestCount(5);
    else if (total >= 660000) setChestCount(4);
    else if (total >= 540000) setChestCount(3);
    else if (total >= 150000) setChestCount(2);
    else if (total >= 40000) setChestCount(1);
    else setChestCount(0);
  };

  const getRemainingPoints = (total: number): number => {
    const nextThreshold = getNextChestThreshold(total);
    return nextThreshold - total;
  };

  const getNormalizedTotalReward = (total: number): number => {
    for (let i = 0; i < thresholds.length - 1; i++) {
      const currentThreshold = thresholds[i];
      const nextThreshold = thresholds[i + 1];

      if (total >= currentThreshold.score && total < nextThreshold.score) {
        const normalized = (total - currentThreshold.score) / (nextThreshold.score - currentThreshold.score);
        return (i + normalized) * (7200000 / (thresholds.length - 1));
      }
    }
    return total;
  };

  const formatNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  if (!isMounted) return null;

  return (
    <div className={styles.alliances}>
      {titles && titles.length > 0 && (
        <form onSubmit={handleTitleSubmit}>
          <fieldset>
            <legend>연맹대전 선택폼</legend>
            <label htmlFor="allianceSelect">연맹 대전 선택</label>
            <div className={styles.selectbox}>
              <select
                id="allianceSelect"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedAlliance(e.target.value)}
              >
                <option value="">선택하기</option>
                {titles.map((titleObj, index) => (
                  <option key={index} value={titleObj.api}>
                    {titleObj.day} - {titleObj.title}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.button}>
              <button type="submit">선택완료</button>
            </div>
          </fieldset>
        </form>
      )}
      {rewards && rewards.length > 0 && rewards[0].reward > 0 && (
        <form onSubmit={handleSubmit} className={isMobile ? styles['reward-column'] : styles['reward-row']}>
          <fieldset>
            <legend>보상 점수 계산폼</legend>
            {rewards.map((reward, index) => (
              <div key={index} className={styles.group}>
                <label htmlFor="allianceItem">{reward.item}</label>
                <div className={styles.value}>
                  <input
                    type="number"
                    id="allianceItem"
                    onChange={(e) => handleInputChange(e, index)}
                    placeholder="수량 입력"
                  />
                </div>
              </div>
            ))}
            <div className={styles.button}>
              <button type="submit">계산하기</button>
            </div>
          </fieldset>
        </form>
      )}
      {rewards && rewards.length > 0 && rewards[0].reward === 0 && <p>일정이 없는 일요일입니다.</p>}
      {rewards && rewards.length > 0 && rewards[0].reward > 0 && totalReward > 0 && (
        <div className={styles.result}>
          <ProgressBar totalReward={getNormalizedTotalReward(totalReward)} correctionReward={totalReward} />
          <div className={styles.paragraphes}>
            <p>
              {chestCount}상 {totalReward > 7200000 && '이상'} ({formatNumber(totalReward)}점) 입니다.
            </p>
            {chestCount < 9 ? (
              <p>
                {chestCount + 1}상까지는 {formatNumber(getRemainingPoints(totalReward))}점 남았습니다.
              </p>
            ) : (
              <p>최대 상자에 도달했습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

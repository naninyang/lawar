import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styles from '@/styles/Daerogi.module.sass';

interface Reward {
  item: string;
  reward: number;
}

interface ApiResponse {
  title: string;
  rewards: Reward[];
}

interface TitleOption {
  title: string;
  api: string;
}

export default function Alliance() {
  const [selectedAlliance, setSelectedAlliance] = useState<string>('');
  const [titles, setTitles] = useState<TitleOption[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [inputValues, setInputValues] = useState<{ [key: number]: number }>({});
  const [totalReward, setTotalReward] = useState<number>(0);
  const [chestCount, setChestCount] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

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
        fetchedTitles.push({ title: data.title, api });
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

  const formatNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  if (!isMounted) return null;

  return (
    <div className={styles.alliance}>
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
                    {titleObj.title}
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
      {rewards && rewards.length > 0 && rewards[0].reward > 0 ? (
        <form onSubmit={handleSubmit}>
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
      ) : (
        <p>일정이 없는 일요일입니다.</p>
      )}
      {totalReward > 0 && (
        <p>
          {chestCount}상 {chestCount > 8 && '이상'} ({formatNumber(totalReward)}점) 가능합니다.
        </p>
      )}
    </div>
  );
}

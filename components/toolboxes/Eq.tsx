import { useEffect, useState } from 'react';
import styles from '@/styles/Toolboxes.module.sass';

interface EqData {
  [key: string]: { id: string; type: string; number: number };
}

export default function Eq() {
  const [stoneData, setStoneData] = useState<EqData>({});
  const [coinData, setCoinData] = useState<EqData>({});
  const [levels, setLevels] = useState<string[]>([]);
  const [currentLevel, setCurrentLevel] = useState('');
  const [desiredLevel, setDesiredLevel] = useState('');
  const [stoneTotalEq, setStoneTotalEq] = useState(0);
  const [coinTotalEq, setCoinTotalEq] = useState(0);

  useEffect(() => {
    fetch('/api/eq')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
          const stoneLevelData: EqData = data[0];
          const coinLevelData: EqData = data[1];

          const sortedLevels = Object.keys(stoneLevelData)
            .filter((key) => !isNaN(Number(key)))
            .sort((a, b) => Number(a) - Number(b));

          setStoneData(stoneLevelData);
          setCoinData(coinLevelData);
          setLevels(sortedLevels);
          setCurrentLevel(sortedLevels[0] || '');
          setDesiredLevel(sortedLevels[1] || '');
        }
      })
      .catch((error) => console.error('데이터 로드 실패:', error));
  }, []);

  useEffect(() => {
    if (currentLevel && desiredLevel) {
      let stoneSum = 0;
      let coinSum = 0;

      for (let i = Number(currentLevel) + 1; i <= Number(desiredLevel); i++) {
        const key = i.toString();
        if (stoneData[key]) {
          stoneSum += stoneData[key].number;
        }
        if (coinData[key]) {
          coinSum += coinData[key].number;
        }
      }

      setStoneTotalEq(stoneSum);
      setCoinTotalEq(coinSum);
    }
  }, [currentLevel, desiredLevel, stoneData, coinData]);

  return (
    <div className={styles.exp}>
      <form>
        <fieldset>
          <legend>레벨선택 폼</legend>
          <div className={styles.group}>
            <label>현재 레벨</label>
            <div className={styles.selectbox}>
              <select value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)}>
                {levels.length > 0 ? (
                  levels.map((level) => (
                    <option key={level} value={level}>
                      레벨 {level}
                    </option>
                  ))
                ) : (
                  <option>데이터 없음</option>
                )}
              </select>
            </div>
          </div>
          <div className={styles.group}>
            <label>원하는 레벨</label>
            <div className={styles.selectbox}>
              <select value={desiredLevel} onChange={(e) => setDesiredLevel(e.target.value)}>
                {levels.length > 0 ? (
                  levels
                    .filter((level) => Number(level) > Number(currentLevel))
                    .map((level) => (
                      <option key={level} value={level}>
                        레벨 {level}
                      </option>
                    ))
                ) : (
                  <option>데이터 없음</option>
                )}
              </select>
            </div>
          </div>
        </fieldset>
      </form>
      <dl>
        <dt>필요한 금화 및 강화석</dt>
        <dd>
          <strong>금화</strong>{' '}
          {coinTotalEq >= 1_000_000
            ? `${(coinTotalEq / 1_000_000).toFixed(1)} M`
            : coinTotalEq >= 1_000
              ? `${(coinTotalEq / 1_000).toFixed(1)} K`
              : coinTotalEq}
          , <strong>강화석</strong>{' '}
          {stoneTotalEq >= 1_000_000
            ? `${(stoneTotalEq / 1_000_000).toFixed(1)} M`
            : stoneTotalEq >= 1_000
              ? `${(stoneTotalEq / 1_000).toFixed(1)} K`
              : stoneTotalEq}
        </dd>
      </dl>
    </div>
  );
}

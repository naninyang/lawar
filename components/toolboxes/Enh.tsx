import { useEffect, useState } from 'react';
import styles from '@/styles/Toolboxes.module.sass';

interface EnhData {
  [key: string]: { id: string; type: string; number: number };
}

export default function Enh() {
  const [enhData, setEnhData] = useState<EnhData>({});
  const [levels, setLevels] = useState<string[]>([]);
  const [currentLevel, setCurrentLevel] = useState('');
  const [desiredLevel, setDesiredLevel] = useState('');
  const [totalEnh, setTotalEnh] = useState(0);

  useEffect(() => {
    fetch('/api/enh')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
          const levelData: EnhData = data[0];
          const sortedLevels = Object.keys(levelData)
            .filter((key) => !isNaN(Number(key)))
            .sort((a, b) => Number(a) - Number(b));

          setEnhData(levelData);
          setLevels(sortedLevels);
          setCurrentLevel(sortedLevels[0] || '');
          setDesiredLevel(sortedLevels[1] || '');
        }
      })
      .catch((error) => console.error('데이터 로드 실패:', error));
  }, []);

  useEffect(() => {
    if (currentLevel && desiredLevel) {
      let enhSum = 0;
      for (let i = Number(currentLevel) + 1; i <= Number(desiredLevel); i++) {
        const key = i.toString();
        if (enhData[key]) {
          enhSum += enhData[key].number;
        }
      }
      setTotalEnh(enhSum);
    }
  }, [currentLevel, desiredLevel, enhData]);
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
        <dt>필요한 스킬훈장</dt>
        <dd>
          {totalEnh}{' '}
          {totalEnh >= 1_000 && (
            <>
              (
              {totalEnh >= 1_000_000
                ? `${(totalEnh / 1_000_000).toFixed(1)} M`
                : totalEnh >= 1_000
                  ? `${(totalEnh / 1_000).toFixed(1)} K`
                  : ''}
              )
            </>
          )}
        </dd>
      </dl>
    </div>
  );
}

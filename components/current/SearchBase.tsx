import React, { useEffect, useState } from 'react';
import Seo, { originTitle } from '@/components/Seo';
import styles from '@/styles/Home.module.sass';

interface BaseData {
  level: string;
  building: string;
  time: string;
  steel: string;
  gold: string;
}

export default function SearchBase() {
  const [base, setBase] = useState<BaseData[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedData, setSelectedData] = useState<BaseData | null>(null);

  useEffect(() => {
    const fetchBase = async () => {
      const response = await fetch('/api/base');
      const result = await response.json();
      setBase(result);
    };
    fetchBase();
  }, []);

  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const data = base.find((row) => row.level === selectedLevel);
    setSelectedData(data || null);
  };

  return (
    <div className={styles.searchBase}>
      {base.length > 0 ? (
        <>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>레벨 선택폼</legend>
              <div className={styles.selectbox}>
                <select id="levelSelect" value={selectedLevel} onChange={handleLevelChange} required>
                  <option value="">레벨을 선택하세요</option>
                  {base.map((row) => (
                    <option key={row.level} value={row.level}>
                      {row.level}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.button}>
                <button type="submit">선택</button>
              </div>
            </fieldset>
          </form>
          {selectedData ? (
            <dl>
              <div>
                <dt>필수 건물업</dt>
                <dd>{selectedData.building}, 테크센터</dd>
              </div>
              <div>
                <dt>원래 시간</dt>
                <dd>{selectedData.time}</dd>
              </div>
              <div>
                <dt>강철/식량</dt>
                <dd>{selectedData.steel}</dd>
              </div>
              <div>
                <dt>금화</dt>
                <dd>{selectedData.gold}</dd>
              </div>
            </dl>
          ) : (
            <p>
              <span>레벨을 선택하시면</span> 필수업 등 정보를 보실 수 있어요
            </p>
          )}
        </>
      ) : (
        <p>데이터를 불러오는 중입니다 :)</p>
      )}
    </div>
  );
}

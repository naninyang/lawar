import React, { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.sass';

interface DroneData {
  level: string;
  parts: string;
}

export default function SearchDrone() {
  const [drone, setDrone] = useState<DroneData[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedData, setSelectedData] = useState<DroneData | null>(null);

  useEffect(() => {
    const fetchDrone = async () => {
      const response = await fetch('/api/drone');
      const result = await response.json();
      setDrone(result);
    };
    fetchDrone();
  }, []);

  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const data = drone.find((row) => row.level === selectedLevel);
    setSelectedData(data || null);
  };

  return (
    <div className={styles.searchDrone}>
      {drone.length > 0 ? (
        <>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>레벨 선택폼</legend>
              <div className={styles.selectbox}>
                <select id="levelSelect" value={selectedLevel} onChange={handleLevelChange} required>
                  <option value="">레벨을 선택하세요</option>
                  {drone.map((row) => (
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
                <dt>필요 드론 부품</dt>
                <dd>{selectedData.parts} 개</dd>
              </div>
            </dl>
          ) : (
            <p>
              <span>레벨을 선택하세요</span>
            </p>
          )}
        </>
      ) : (
        <p>데이터를 불러오는 중입니다 :)</p>
      )}
    </div>
  );
}

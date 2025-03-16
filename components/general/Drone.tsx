import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Seo, { originTitle } from '@/components/Seo';
import styles from '@/styles/Drone.module.sass';

interface DroneData {
  level: string;
  parts: string;
}

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

export default function Drone() {
  const [drone, setDrone] = useState<DroneData[]>([]);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const isMobile = useMobile();

  useEffect(() => {
    const fetchDrone = async () => {
      const response = await fetch('/api/drone');
      const result = await response.json();
      setDrone(result);
    };
    fetchDrone();
  }, []);

  const handleRowClick = (index: string) => {
    setSelectedRow(index);
  };

  const firstHalf = drone.slice(0, 20);
  const secondHalf = drone.slice(20);

  const timestamp = Date.now();
  return (
    <main className={styles.drone}>
      <Seo
        pageTitles={`드론 업 정보 - ${originTitle}`}
        pageTitle="드론 업 정보"
        pageDescription="드론 업에 필요한 정보를 확인하세요"
        pageImg={`https://lawar.dev1stud.io/og-drone.webp?ts=${timestamp}`}
      />
      <h2>드론 업 정보</h2>
      <ul>
        <li>원하는 레벨을 누르시면 좀 더 편하게 보실 수 있습니다.</li>
        <li>전투데이터는 생략하였습니다.</li>
      </ul>
      {drone.length > 0 ? (
        <>
          {isMobile ? (
            <div className={styles.table}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">드론 레벨</th>
                    <th scope="col">드론 부품</th>
                  </tr>
                </thead>
                <tbody>
                  {drone.slice().map((row, index) => (
                    <tr
                      key={`origin-${index}`}
                      className={selectedRow === 'origin' + index ? styles.current : undefined}
                      onClick={() => handleRowClick('origin' + index)}
                    >
                      <td>{row.level}</td>
                      <td>{row.parts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.container}>
              <div className={styles.table}>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">드론 레벨</th>
                      <th scope="col">드론 부품</th>
                    </tr>
                  </thead>
                  <tbody>
                    {firstHalf.map((row, index) => (
                      <tr
                        key={`first-${index}`}
                        className={selectedRow === 'first' + index ? styles.current : undefined}
                        onClick={() => handleRowClick('first' + index)}
                      >
                        <td>{row.level}</td>
                        <td>{row.parts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.table}>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">드론 레벨</th>
                      <th scope="col">드론 부품</th>
                    </tr>
                  </thead>
                  <tbody>
                    {secondHalf.map((row, index) => (
                      <tr
                        key={`second-${index + 20}`}
                        className={selectedRow === 'second' + index ? styles.current : undefined}
                        onClick={() => handleRowClick('second' + index)}
                      >
                        <td>{row.level}</td>
                        <td>{row.parts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>데이터를 불러오는 중입니다 :)</p>
      )}
    </main>
  );
}

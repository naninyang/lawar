import { useEffect, useState } from 'react';
import Seo, { originTitle } from '@/components/Seo';
import styles from '@/styles/Base.module.sass';

interface BaseData {
  level: string;
  building: string;
  time: string;
  steel: string;
  gold: string;
}

export default function Base() {
  const [data, setData] = useState<BaseData[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/base');
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, []);

  const handleRowClick = (index: number) => {
    setSelectedRow(index);
  };

  const timestamp = Date.now();
  return (
    <main className={styles.base}>
      <Seo
        pageTitles={`기지 업 기본 정보 - ${originTitle}`}
        pageTitle="기지 업 기본 정보"
        pageDescription="기지 업에 필요한 기본 정보를 확인하세요"
        pageImg={`https://lawar.dev1stud.io/og-base.webp?ts=${timestamp}`}
      />
      <h2>기지 업 기본 정보</h2>
      <ul>
        <li>원하는 구간을 누르시면 좀 더 편하게 보실 수 있습니다.</li>
        <li>1 ~ 10레벨 구간은 생략하였습니다.</li>
        <li>모든 레벨 공통 필수업 건물인 테크 센터는 공통사항이기 때문에 생략하였습니다.</li>
        <li>
          시간은 그 어떤 버프도 받지 않은, 기본 원래 시간 기준입니다. 실제 시간은 테크 연구 상태, VIP, 건설 장관 버프,
          연맹 지원, 각 건물 파견 생존자, 연맹 센터 상태에 따라 변동이 있을 수 있습니다. VIP, 장관 버프는 50% 각각
          적용되어 업그레이드 시간이 줄어들며 같이 사용시 중첩하여 적용됩니다.
        </li>
        <li>
          자원은 필수 건물 업에 들어가는 자원 미포함이며 기지 건물 업하는데 들어가는 자원입니다. 또한 테크 및 생존자
          상태에 따라서 유동적입니다. 참고용으로만 사용하세요.
        </li>
      </ul>
      {data.length > 0 ? (
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th scope="col">기지 레벨</th>
                <th scope="col">필수 건물업</th>
                <th scope="col">원래 시간</th>
                <th scope="col">강철/식량</th>
                <th scope="col">금화</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className={selectedRow === index ? styles.current : undefined}
                  onClick={() => handleRowClick(index)}
                >
                  <td>{row.level}</td>
                  <td>{row.building}</td>
                  <td>{row.time}</td>
                  <td>{row.steel}</td>
                  <td>{row.gold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>데이터를 불러오는 중입니다 :)</p>
      )}
    </main>
  );
}

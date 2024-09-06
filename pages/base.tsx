import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Seo, { originTitle } from '@/components/Seo';
import styles from '@/styles/Base.module.sass';

interface BaseData {
  level: string;
  building: string;
  time: string;
  steel: string;
  gold: string;
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

export default function Base() {
  const [base, setBase] = useState<BaseData[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const isMobile = useMobile();

  useEffect(() => {
    const fetchBase = async () => {
      const response = await fetch('/api/base');
      const result = await response.json();
      setBase(result);
    };
    fetchBase();
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
          건물 중 ‘탱크 센터’는 ‘미사일 차량 센터’, ‘전투기 센터’, ‘탱크 센터’ 셋 중 하나 입니다. 키우고 있는 영웅이
          탱크라면 ‘탱크 센터’를, 전투기라면 ‘전투기 센터’를, 미사일이라면 ‘미사일 차량 센터’를 올리면 됩니다.
        </li>
        <li>
          시간은 그 어떤 버프도 받지 않은, 기본 원래 시간 기준입니다. 실제 시간은 테크 연구 상태, VIP, 건설 장관 버프,
          연맹 지원, 각 건물 파견 생존자, 연맹 센터 상태에 따라 변동이 있을 수 있습니다. VIP, 건설 장관 버프는 50% 각각
          적용되어 업그레이드 시간이 줄어들며 같이 사용시 중첩하여 적용됩니다.
        </li>
        <li>과학 부장 버프는 25% 적용됩니다.</li>
        <li>
          자원은 필수 건물 업에 들어가는 자원 미포함이며 기지 건물 업하는데 들어가는 자원입니다. 또한 테크 및 생존자
          상태에 따라서 유동적입니다. 참고용으로만 사용하세요.
        </li>
      </ul>
      {base.length > 0 ? (
        <>
          {isMobile ? (
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
                  {base
                    .slice()
                    .reverse()
                    .map((row, index) => (
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
            <div className={styles.items}>
              <ul>
                {base
                  .slice()
                  .reverse()
                  .map((row, index) => (
                    <li
                      key={index}
                      className={selectedRow === index ? styles.current : undefined}
                      onClick={() => handleRowClick(index)}
                    >
                      <dl>
                        <div>
                          <dt>기지 레벨</dt>
                          <dd>{row.level}</dd>
                        </div>
                        <div>
                          <dt>필수 건물업</dt>
                          <dd>{row.building}</dd>
                        </div>
                        <div>
                          <dt>원래 시간</dt>
                          <dd>{row.time}</dd>
                        </div>
                        <div>
                          <dt>강철/식량</dt>
                          <dd>{row.steel}</dd>
                        </div>
                        <div>
                          <dt>금화</dt>
                          <dd>{row.gold}</dd>
                        </div>
                      </dl>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p>데이터를 불러오는 중입니다 :)</p>
      )}
    </main>
  );
}

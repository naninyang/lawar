import React, { useEffect, useState } from 'react';
import styles from '@/styles/General.module.sass';

export interface LawarItem {
  id: number;
  documentId: string;
  subject: string;
  summary?: any;
  matchingTime?: any;
  createdAt: string;
}

export default function DaerogiItems() {
  const [matching, setMatching] = useState<LawarItem[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/matching`);
      const result = await response.json();

      const formattedData: LawarItem[] = result.data.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        subject: item.subject,
        summary: item.summary,
        matchingTime: item.matchingTime,
        createdAt: item.createdAt,
      }));

      setMatching(formattedData);
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className={styles.summary}>
      {loading && <p>데이터를 불러오는 중입니다 :)</p>}
      {error && <p>일시적인 오류입니다. 지속적으로 문제 발생시 1157iamari@gmail.com으로 문의주세요.</p>}
      {!loading && !error && matching && (
        <ul className={styles.matching}>
          {matching.map((item: LawarItem, index: number) => (
            <li key={index}>
              <div className={styles.item}>
                <div className={styles.week}>
                  <strong>{item.subject}</strong>
                </div>
                {item.subject !== '일요일 (연맹 대전 없음)' && (
                  <dl>
                    {item.summary &&
                      item.matchingTime &&
                      item.summary.map((summaryItem: any, i: number) => (
                        <div key={i}>
                          {Object.entries(summaryItem).map(([key, value]: [string, any], idx: number) => (
                            <React.Fragment key={idx}>
                              <dt>
                                <strong>매칭 연맹 대전</strong>
                                <span>
                                  {key.split(',').map((splitKey: string, j: number) => (
                                    <em key={j}>{splitKey.trim()}</em>
                                  ))}
                                </span>
                              </dt>
                              <dd>
                                <strong>매칭 군비 경쟁</strong>
                                <span>{String(value)}</span>
                              </dd>
                              <dd>
                                <strong>매칭 시간</strong>
                                <span>{item.matchingTime[i] ? item.matchingTime[i] : '매칭 시간이 없습니다'}</span>
                              </dd>
                            </React.Fragment>
                          ))}
                        </div>
                      ))}
                  </dl>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

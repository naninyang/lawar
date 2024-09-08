import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Anchor from '@/components/Anchor';
import styles from '@/styles/Daerogi.module.sass';

export interface LawarItem {
  id: number;
  subject: string;
  summary: any;
}

export default function DaerogiItems() {
  const [rogiking, setRogiking] = useState<LawarItem[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authInLocalStorage = localStorage.getItem('auth');
    const authInCookies = document.cookie.includes('auth=');

    if (authInLocalStorage && !authInCookies) {
      document.cookie = `auth=${authInLocalStorage}; path=/;`;
    } else if (!authInLocalStorage && !authInCookies) {
      router.push('/login');
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/daerogi`);
      const result = await response.json();

      const formattedData: LawarItem[] = result.data.map((item: any) => ({
        id: item.id,
        subject: item.attributes.subject,
        summary: item.attributes.summary,
      }));

      setRogiking(formattedData);
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
    <main className={styles.list}>
      {loading && <p>데이터를 불러오는 중입니다 :)</p>}
      {error && <p>일시적인 오류입니다. 지속적으로 문제 발생시 아리를 호출하세요.</p>}
      {!loading && !error && rogiking && (
        <ul>
          {rogiking.map((daerogi: LawarItem, index: number) => (
            <li key={index}>
              <div className={styles.item}>
                <Anchor href={`/daerogi/${daerogi.id}`}>
                  <strong>{daerogi.subject}</strong>
                  <span>
                    <strong>더 보기</strong>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M14 4.92969L12.5 6.42969L17.0703 11H3V13H17.0703L12.5 17.5703L14 19.0703L21.0703 12L14 4.92969Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </Anchor>
                <dl>
                  {daerogi.summary &&
                    daerogi.summary.map((summaryItem: any, i: number) => (
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
                              {String(value)}
                            </dd>
                          </React.Fragment>
                        ))}
                      </div>
                    ))}
                </dl>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

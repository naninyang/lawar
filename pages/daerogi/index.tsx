import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Anchor from '@/components/Anchor';
import styles from '@/styles/Daerogi.module.sass';
import { componentMap } from './toolboxes/[toolboxId]';

export interface LawarItem {
  id: number;
  subject: string;
  summary?: any;
  matchingtime?: any;
}

export default function DaerogiItems() {
  const [matching, setMatching] = useState<LawarItem[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authInLocalStorage = localStorage.getItem('auth');
    const authInCookies = document.cookie.includes('auth=');

    if (authInLocalStorage && !authInCookies) {
      document.cookie = `auth=${authInLocalStorage}; path=/;`;
    } else if (!authInLocalStorage && !authInCookies) {
      router.push('/daerogi/login');
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/matching`);
      const result = await response.json();

      const formattedData: LawarItem[] = result.data.map((item: any) => ({
        id: item.id,
        subject: item.attributes.subject,
        summary: item.attributes.summary,
        matchingtime: item.attributes.matchingtime,
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
    <main className={styles.list}>
      {loading && <p>데이터를 불러오는 중입니다 :)</p>}
      {error && <p>일시적인 오류입니다. 지속적으로 문제 발생시 아리를 호출하세요.</p>}
      <ul className={styles.toolbox}>
        {Object.keys(componentMap).map((toolboxId, index) => {
          const { title } = componentMap[toolboxId];
          const { name } = componentMap[toolboxId];
          return (
            <li
              key={toolboxId}
              className={router.asPath === `/daerogi/toolboxes/${toolboxId}` ? styles.current : undefined}
            >
              <Anchor href={`/daerogi/toolboxes/${toolboxId}`}>
                {name === 'unit' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18 2H6C4.895 2 4 2.895 4 4V20C4 21.105 4.895 22 6 22H18C19.105 22 20 21.105 20 20V4C20 2.895 19.105 2 18 2ZM17 8H7C6.448 8 6 7.552 6 7V5C6 4.448 6.448 4 7 4H17C17.552 4 18 4.448 18 5V7C18 7.552 17.552 8 17 8ZM16 20H12C11.448 20 11 19.552 11 19C11 18.448 11.448 18 12 18H16C16.552 18 17 18.448 17 19C17 19.552 16.552 20 16 20ZM9 19C9 19.552 8.552 20 8 20C7.448 20 7 19.552 7 19C7 18.448 7.448 18 8 18C8.552 18 9 18.448 9 19ZM9 15C9 15.552 8.552 16 8 16C7.448 16 7 15.552 7 15C7 14.448 7.448 14 8 14C8.552 14 9 14.448 9 15ZM9 11C9 11.552 8.552 12 8 12C7.448 12 7 11.552 7 11C7 10.448 7.448 10 8 10C8.552 10 9 10.448 9 11ZM13 15C13 15.552 12.552 16 12 16C11.448 16 11 15.552 11 15C11 14.448 11.448 14 12 14C12.552 14 13 14.448 13 15ZM13 11C13 11.552 12.552 12 12 12C11.448 12 11 11.552 11 11C11 10.448 11.448 10 12 10C12.552 10 13 10.448 13 11ZM17 15C17 15.552 16.552 16 16 16C15.448 16 15 15.552 15 15C15 14.448 15.448 14 16 14C16.552 14 17 14.448 17 15ZM17 11C17 11.552 16.552 12 16 12C15.448 12 15 11.552 15 11C15 10.448 15.448 10 16 10C16.552 10 17 10.448 17 11Z"
                      fill="#94E138"
                    />
                  </svg>
                )}
                {name === 'alliance' && (
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 12.453C3 7.48244 7.02944 3.453 12 3.453V3.453C16.9706 3.453 21 7.48244 21 12.453V12.453C21 17.4236 16.9706 21.453 12 21.453V21.453C7.02944 21.453 3 17.4236 3 12.453V12.453Z"
                      fill="#BF6C22"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4 12.453C4 16.8713 7.58172 20.453 12 20.453C16.4183 20.453 20 16.8713 20 12.453C20 8.03473 16.4183 4.453 12 4.453C7.58172 4.453 4 8.03473 4 12.453ZM12 3.453C7.02944 3.453 3 7.48244 3 12.453C3 17.4236 7.02944 21.453 12 21.453C16.9706 21.453 21 17.4236 21 12.453C21 7.48244 16.9706 3.453 12 3.453Z"
                      fill="#FFF2C9"
                    />
                    <path
                      d="M16.432 9.12222C16.2857 9.12568 16.1466 9.18684 16.0452 9.29236L11.9988 13.3387L7.95244 9.29236C7.90074 9.23921 7.8389 9.19696 7.7706 9.16811C7.70229 9.13926 7.62889 9.1244 7.55474 9.12439C7.44437 9.12442 7.33651 9.15737 7.24496 9.21902C7.1534 9.28066 7.08232 9.36822 7.04078 9.47048C6.99925 9.57274 6.98916 9.68507 7.0118 9.79309C7.03444 9.90112 7.08878 9.99994 7.16788 10.0769L11.6065 14.5156C11.7106 14.6196 11.8517 14.678 11.9988 14.678C12.1459 14.678 12.287 14.6196 12.3911 14.5156L16.8297 10.0769C16.9103 9.99944 16.9656 9.89943 16.9884 9.78998C17.0111 9.68054 17.0003 9.56677 16.9573 9.46358C16.9143 9.36039 16.8412 9.27259 16.7475 9.21168C16.6537 9.15077 16.5438 9.11959 16.432 9.12222ZM16.432 12.4512C16.2857 12.4547 16.1466 12.5158 16.0452 12.6213L11.9988 16.6677L7.95244 12.6213C7.90074 12.5682 7.8389 12.5259 7.7706 12.4971C7.70229 12.4682 7.62889 12.4534 7.55474 12.4534C7.44437 12.4534 7.33651 12.4863 7.24496 12.548C7.1534 12.6096 7.08232 12.6972 7.04078 12.7995C6.99925 12.9017 6.98916 13.014 7.0118 13.1221C7.03444 13.2301 7.08878 13.3289 7.16788 13.4059L11.6065 17.8445C11.7106 17.9486 11.8517 18.007 11.9988 18.007C12.1459 18.007 12.287 17.9486 12.3911 17.8445L16.8297 13.4059C16.9103 13.3284 16.9656 13.2284 16.9884 13.119C17.0111 13.0095 17.0003 12.8958 16.9573 12.7926C16.9143 12.6894 16.8412 12.6016 16.7475 12.5407C16.6537 12.4797 16.5438 12.4486 16.432 12.4512Z"
                      fill="#FFF2C9"
                    />
                  </svg>
                )}
                <span>{title}</span>
              </Anchor>
            </li>
          );
        })}
      </ul>

      {!loading && !error && matching && (
        <ul className={styles.matching}>
          {matching.map((item: LawarItem, index: number) => (
            <li key={index}>
              <div className={styles.item}>
                <Anchor href={`/daerogi/matching/${item.id}`}>
                  <strong>{item.subject}</strong>
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
                {item.id < 7 && (
                  <dl>
                    {item.summary &&
                      item.matchingtime &&
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
                                <span>{item.matchingtime[i] ? item.matchingtime[i] : '매칭 시간이 없습니다'}</span>
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

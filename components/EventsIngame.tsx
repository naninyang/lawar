import { useState, useEffect } from 'react';
import { LastEvents } from '@/types';
import styles from '@/styles/Events.module.sass';

function calculateRemainingTime(endTime: Date): { text: string; milliseconds: number } {
  const currentTime = new Date().getTime();
  const timeDifference = endTime.getTime() - currentTime;

  if (timeDifference <= 0) return { text: '0일 0시간 0분 0초 남음', milliseconds: 0 };

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  const text = `${days}일 ${hours}시간 ${minutes}분 ${seconds}초 남음`;
  return { text, milliseconds: timeDifference };
}

export default function EventsIngame() {
  const [eventsData, setEventsData] = useState<LastEvents[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEventsData = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();

      const filteredData = data.results.filter((item: any) => {
        const datetime = item.properties.datetime.date?.start || 'N/A';
        const datetimeObj = new Date(datetime);
        const currentTime = new Date();

        return item.properties.type.select?.name === 'game' && datetimeObj > currentTime;
      });

      const formattedData: LastEvents[] = filteredData.map((item: any) => {
        const datetime = item.properties.datetime.date?.start || 'N/A';
        const datetimeObj = new Date(datetime);
        const remaining = calculateRemainingTime(datetimeObj);

        return {
          type: item.properties.type.select?.name || 'N/A',
          summary: item.properties.summary.title[0]?.plain_text || 'N/A',
          datetime: datetime,
          remainingTime: remaining.text,
          remainingMilliseconds: remaining.milliseconds,
        };
      });

      const sortedData = formattedData.sort((a: LastEvents, b: LastEvents) => {
        const remainingA = a.remainingMilliseconds ?? 0;
        const remainingB = b.remainingMilliseconds ?? 0;
        return remainingB - remainingA;
      });

      localStorage.setItem('eventsData', JSON.stringify(sortedData));

      setEventsData(sortedData);
    } catch (error) {
      console.error('Error fetching Events API data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem('eventsData');

    if (storedData) {
      setEventsData(JSON.parse(storedData));
      setIsLoading(false);
    } else {
      fetchEventsData();
    }

    const countdownInterval = setInterval(() => {
      setEventsData((prevData) =>
        prevData.map((event) => {
          const remaining = calculateRemainingTime(new Date(event.datetime));
          return {
            ...event,
            remainingTime: remaining.text,
            remainingMilliseconds: remaining.milliseconds,
          };
        }),
      );
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  return (
    <div className={`${styles.events} ${styles.special}`}>
      <h3>
        <span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.66992 1.29688C4.34963 2.40178 2.40178 4.34963 1.29688 6.66992L3.10352 7.5293C3.39701 6.91295 3.87486 6.3847 4.3125 5.83594C2.94037 7.54756 2 9.62958 2 12C2 17.5333 6.46667 22 12 22C17.5333 22 22 17.5333 22 12C22 9.62958 21.0596 7.54756 19.6875 5.83594C20.1251 6.3847 20.603 6.91295 20.8965 7.5293L22.7031 6.66992C21.5982 4.34963 19.6504 2.40178 17.3301 1.29688L16.4707 3.10352C17.0871 3.39701 17.6153 3.87486 18.1641 4.3125C16.4524 2.94037 14.3704 2 12 2C9.62958 2 7.54756 2.94037 5.83594 4.3125C6.3847 3.87486 6.91295 3.39701 7.5293 3.10352L6.66992 1.29688ZM12 4C16.4667 4 20 7.53333 20 12C20 16.4667 16.4667 20 12 20C7.53333 20 4 16.4667 4 12C4 7.53333 7.53333 4 12 4ZM11 7V12.4141L14.293 15.707L15.707 14.293L13 11.5859V7H11Z"
              fill="white"
            />
          </svg>
        </span>
        초특가 & 특별 이벤트
      </h3>
      {isLoading ? (
        <p>이벤트를 불러오는 중입니다 :)</p>
      ) : eventsData.length === 0 ? (
        <p>등록된 이벤트가 없습니다. 아리를 닥달해 보세요 (...)</p>
      ) : (
        <ul>
          {eventsData.map((event: any, index: number) => (
            <li key={index}>
              <cite>{event.summary}</cite>
              <strong>{event.remainingTime}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

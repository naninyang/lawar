import { useState, useEffect } from 'react';
import styles from '@/styles/Events.module.sass';

interface TaskDue {
  datetime: string | null;
}

interface Task {
  content: string;
  due: TaskDue;
  order: number;
  labels: string[];
}

function formatDateToLocal(dateString: string | null): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일 ${hours}시`;
}

export default function Events() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/todoist/tasks');
        const data: Task[] = await response.json();
        data.sort((a, b) => a.order - b.order);
        setTasks(
          data
            .filter((task) => !task.labels.includes('game'))
            .filter((task) => {
              const now = new Date();
              const taskTime = new Date(task.due.datetime!);
              const taskEndTime = new Date(taskTime.getTime() + 30 * 60000);
              const sixHoursAfterEndTime = new Date(taskEndTime.getTime() + 6 * 60 * 60000);

              return now <= sixHoursAfterEndTime;
            }),
        );
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className={styles.events}>
      <h3>
        <span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C11.172 2 10.5 2.672 10.5 3.5V4.19531C7.91318 4.86209 6 7.2048 6 10V16L4 18V19H10.2695C10.0934 19.3039 10.0005 19.6488 10 20C10 20.5304 10.2107 21.0391 10.5858 21.4142C10.9609 21.7893 11.4696 22 12 22C12.5304 22 13.0391 21.7893 13.4142 21.4142C13.7893 21.0391 14 20.5304 14 20C13.9989 19.6486 13.9053 19.3037 13.7285 19H20V18L18 16V10C18 7.2048 16.0868 4.86209 13.5 4.19531V3.5C13.5 2.672 12.828 2 12 2ZM5.9082 2.08203C3.5352 3.91003 2 6.772 2 10H4C4 7.418 5.22895 5.12802 7.12695 3.66602L5.9082 2.08203ZM18.0918 2.08203L16.873 3.66602C18.771 5.12802 20 7.418 20 10H22C22 6.772 20.4648 3.91003 18.0918 2.08203ZM12 6C14.206 6 16 7.794 16 10V16V16.8281L16.1719 17H7.82812L8 16.8281V16V10C8 7.794 9.794 6 12 6Z"
              fill="white"
            />
          </svg>
        </span>
        N1W 연맹 이벤트 알림
      </h3>
      {isLoading ? (
        <p>이벤트를 불러오는 중입니다 :)</p>
      ) : tasks.length === 0 ? (
        <p>등록된 이벤트가 없습니다. 아리를 닥달해 보세요 (...)</p>
      ) : (
        <ul>
          {tasks.map((task) => {
            const now = new Date();
            const taskTime = new Date(task.due.datetime!);
            const taskEndTime = new Date(taskTime.getTime() + 30 * 60000);

            let status;
            if (now < taskTime) {
              status = '진행 전';
            } else if (now >= taskTime && now <= taskEndTime) {
              status = '진행 중';
            } else {
              status = '종료';
            }

            return (
              <li key={task.order}>
                <cite>{task.content}</cite>
                <strong>{formatDateToLocal(task.due.datetime)} 시작</strong>
                <time
                  className={
                    now < taskTime ? styles.time : now >= taskTime && now <= taskEndTime ? styles.ing : styles.due
                  }
                >
                  <span>{status}</span>
                </time>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

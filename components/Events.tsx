import { useState, useEffect } from 'react';
import styles from '@/styles/Events.module.sass';

interface TaskDue {
  datetime: string | null;
}

interface Task {
  content: string;
  due: TaskDue;
  order: number;
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
          data.filter((task) => {
            const now = new Date();
            const taskTime = new Date(task.due.datetime!);
            const taskEndTime = new Date(taskTime.getTime() + 30 * 60000);
            const sixHoursAfterEndTime = new Date(taskEndTime.getTime() + 6 * 60 * 60000);

            // 종료된 후 6시간이 지나지 않은 작업만 유지
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
              d="M6.66992 1.29688C4.34963 2.40178 2.40178 4.34963 1.29688 6.66992L3.10352 7.5293C3.39701 6.91295 3.87486 6.3847 4.3125 5.83594C2.94037 7.54756 2 9.62958 2 12C2 17.5333 6.46667 22 12 22C17.5333 22 22 17.5333 22 12C22 9.62958 21.0596 7.54756 19.6875 5.83594C20.1251 6.3847 20.603 6.91295 20.8965 7.5293L22.7031 6.66992C21.5982 4.34963 19.6504 2.40178 17.3301 1.29688L16.4707 3.10352C17.0871 3.39701 17.6153 3.87486 18.1641 4.3125C16.4524 2.94037 14.3704 2 12 2C9.62958 2 7.54756 2.94037 5.83594 4.3125C6.3847 3.87486 6.91295 3.39701 7.5293 3.10352L6.66992 1.29688ZM12 4C16.4667 4 20 7.53333 20 12C20 16.4667 16.4667 20 12 20C7.53333 20 4 16.4667 4 12C4 7.53333 7.53333 4 12 4ZM11 7V12.4141L14.293 15.707L15.707 14.293L13 11.5859V7H11Z"
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
                <strong>{formatDateToLocal(task.due.datetime)}</strong>
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

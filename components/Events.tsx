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
      <h3>N1W 연맹 이벤트 알림</h3>
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
                  {status}
                </time>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

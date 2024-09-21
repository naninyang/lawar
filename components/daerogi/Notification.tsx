import { useEffect, useState } from 'react';
import styles from '@/styles/Daerogi.module.sass';

interface MentionAttributes {
  id: number;
  attributes: {
    messageBefore: string;
    message: string;
    postAt: string;
  };
}

interface UserAttributes {
  id: number;
  attributes: {
    userName: string;
    userId: string;
  };
}

export default function Notification() {
  const [slackMentions, setSlackMentions] = useState<MentionAttributes[]>([]);
  const [slackUserIds, setSlackUserIds] = useState<UserAttributes[]>([]);
  const [reservedMessage, setReservedMessage] = useState('');
  const [reservedBeforeMessage, setReservedBeforeMessage] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const mentionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slackMentionForAll`);
      const mentionData = await mentionResponse.json();
      setSlackMentions(mentionData.data);

      const userIdsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slackUser`);
      const userIdsData = await userIdsResponse.json();
      setSlackUserIds(userIdsData.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const maxHour = (currentHour + 12) % 24;

  const getAvailableMinutes = () => {
    if (selectedHour === '') return [];

    const selectedHourInt = parseInt(selectedHour, 10);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    if (selectedHourInt === currentHour) {
      return minutes.filter((minute) => minute >= currentMinute + 5);
    }

    return minutes;
  };

  const getAvailableHours = () => {
    if (currentHour + 12 > 24) {
      return Array.from({ length: 24 - currentHour }, (_, i) => (currentHour + i) % 24).concat(
        Array.from({ length: maxHour }, (_, i) => i),
      );
    }
    return Array.from({ length: 13 }, (_, i) => (currentHour + i) % 24);
  };

  const scheduleSlackMessage = async (messageText: string, timestamp: number) => {
    const mentions = slackUserIds.map((user) => `<@${user.attributes.userId}>`).join(' ');
    const response = await fetch('/api/slackMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: '#last_daerogi',
        text: `${mentions} ${messageText}`,
        postAt: timestamp,
      }),
    });

    const result = await response.json();
    return result.success;
  };

  const sendToSlackMentions = async (timestamp: number) => {
    const response = await fetch('/api/slackMentionForAll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageBefore: reservedBeforeMessage,
        message: reservedMessage,
        postAt: new Date(timestamp * 1000).toISOString(),
      }),
    });

    return response.ok;
  };

  const sendScheduledMention = async (e: React.FormEvent) => {
    e.preventDefault();

    if (reservedMessage === '' || selectedHour === '' || selectedMinute === '') {
      alert('메시지와 시간을 입력해야 합니다.');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    let targetDate = new Date(now);
    targetDate.setHours(Number(selectedHour));
    targetDate.setMinutes(Number(selectedMinute));

    if (targetDate < now) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const timestamp = Math.floor(targetDate.getTime() / 1000);

    if (timestamp <= Math.floor(Date.now() / 1000)) {
      alert('예약 시간이 현재 시간보다 과거일 수 없습니다.');
      setIsSubmitting(false);
      return;
    }

    const reservationBefore = new Date(targetDate.getTime() - 3 * 60 * 1000);
    const reservationBeforeTimestamp = Math.floor(reservationBefore.getTime() / 1000);

    const successBefore = await scheduleSlackMessage(reservedBeforeMessage, reservationBeforeTimestamp);
    const successOnTime = await scheduleSlackMessage(reservedMessage, timestamp);
    const slackMentionsSuccess = await sendToSlackMentions(timestamp);

    if (successBefore && successOnTime && slackMentionsSuccess) {
      alert('성공적으로 예약되었습니다.');
      await fetchData();
    } else {
      alert('알람 예약에 실패했습니다.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className={`${styles.notification} ${styles.notifications}`}>
      <div className={styles.alarm}>
        <h3>단체 알람</h3>
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th scope="col">알람 시간</th>
                <th scope="col">3분전 메시지</th>
                <th scope="col">해당시간 메시지</th>
              </tr>
            </thead>
            <tbody>
              {slackMentions
                .filter((mention) => new Date(mention.attributes.postAt) >= new Date())
                .sort((a, b) => new Date(a.attributes.postAt).getTime() - new Date(b.attributes.postAt).getTime())
                .map((mention, index) => {
                  const date = new Date(mention.attributes.postAt);
                  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: 'Asia/Seoul',
                  }).format(date);
                  return (
                    <tr key={index}>
                      <td>{formattedDate}</td>
                      <td>{mention.attributes.messageBefore}</td>
                      <td>{mention.attributes.message}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <form className={styles.form} onSubmit={sendScheduledMention}>
          <fieldset>
            <legend>알람 설정폼</legend>
            <div className={styles.selectors}>
              <div className={styles.selector}>
                <input
                  type="text"
                  placeholder="3분전 메시지"
                  value={reservedBeforeMessage}
                  onChange={(e) => setReservedBeforeMessage(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.selector}>
                <input
                  type="text"
                  placeholder="해당시간 메시지"
                  value={reservedMessage}
                  onChange={(e) => setReservedMessage(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className={styles.selectors}>
              <div className={styles.selector}>
                <select
                  id="hourSelect"
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">시간 선택</option>
                  {getAvailableHours().map((hour) => (
                    <option key={hour} value={hour}>
                      {hour.toString().padStart(2, '0')}시
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.selector}>
                <select
                  id="minuteSelect"
                  value={selectedMinute}
                  onChange={(e) => setSelectedMinute(e.target.value)}
                  disabled={selectedHour === '' || isSubmitting}
                >
                  <option value="">{selectedHour === '' ? '시간 먼저 선택하세요' : '분 선택'}</option>
                  {getAvailableMinutes().map((minute) => (
                    <option key={minute} value={minute}>
                      {minute.toString().padStart(2, '0')}분
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.submit}>
              <button type="submit" disabled={isSubmitting}>
                <span>{isSubmitting ? '설정 중...' : '설정 완료'}</span>
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

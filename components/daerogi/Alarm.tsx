import { useEffect, useState } from 'react';
import styles from '@/styles/Daerogi.module.sass';

interface MentionAttributes {
  id: number;
  documentId: string;
  userName: string;
  message: string;
  postAt: string;
}

interface UserAttributes {
  id: number;
  documentId: string;
  userName: string;
  userId: string;
}

export default function Alarm() {
  const [slackMentions, setSlackMentions] = useState<MentionAttributes[]>([]);
  const [slackUserIds, setSlackUserIds] = useState<UserAttributes[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [selectedMessage, setSelectedMessage] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const mentionResponse = await fetch(`/api/slackMention`);
      const mentionData = await mentionResponse.json();
      const filteredMentions = (mentionData.data as MentionAttributes[])
        .filter((mention) => new Date(mention.postAt) >= new Date())
        .sort((a, b) => new Date(a.postAt).getTime() - new Date(b.postAt).getTime());
      setSlackMentions(filteredMentions);

      const userIdsResponse = await fetch(`/api/slackUser`);
      const userIdsData = await userIdsResponse.json();
      setSlackUserIds(userIdsData.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const users = slackUserIds.map((user) => ({
    name: user.userName,
    id: user.userId,
  }));

  const messages = [
    { label: '은밀회수', value: '은밀회수' },
    { label: '전략장관', value: '전략장관' },
    { label: '국방부장관', value: '국방부장관' },
    { label: '건설장관', value: '건설장관' },
    { label: '과학부장', value: '과학부장' },
    { label: '내무장관', value: '내무장관' },
  ];

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
    const response = await fetch('/api/slackMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: '#last_daerogi',
        text: `${selectedUserName} - ${messageText}`,
        postAt: timestamp,
        userId: selectedUser,
      }),
    });

    const result = await response.json();
    return result.success;
  };

  const sendToSlackMentions = async (timestamp: number) => {
    const response = await fetch('/api/slackMention', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: selectedUserName,
        message: selectedMessage,
        postAt: new Date(timestamp * 1000).toISOString(),
      }),
    });

    return response.ok;
  };

  const handleTimeSelect = () => {
    if (selectedMessage === '은밀회수') {
      return (
        <>
          <div className={styles.selector}>
            <select
              id="hourSelect"
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">남은 시간 선택</option>
              {Array.from({ length: 4 }, (_, i) => i).map((hour) => (
                <option key={hour} value={hour}>
                  {hour}시간
                </option>
              ))}
            </select>
          </div>
          <div className={styles.selector}>
            <select
              id="minuteSelect"
              value={selectedMinute}
              onChange={(e) => setSelectedMinute(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">분 선택</option>
              {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                <option key={minute} value={minute}>
                  {minute}분
                </option>
              ))}
            </select>
          </div>
        </>
      );
    } else {
      return (
        <>
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
        </>
      );
    }
  };

  const sendScheduledMention = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUser === '' || selectedMessage === '' || selectedHour === '' || selectedMinute === '') {
      alert('항목 하나라도 선택하지 않으면 설정을 완료할 수 없어요. :(');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    let targetDate: Date;
    if (selectedMessage === '은밀회수') {
      const additionalHours = Number(selectedHour);
      const additionalMinutes = Number(selectedMinute);

      targetDate = new Date(now.getTime());
      targetDate.setHours(now.getHours() + additionalHours);
      targetDate.setMinutes(now.getMinutes() + additionalMinutes);
    } else {
      targetDate = new Date(now);
      targetDate.setHours(Number(selectedHour));
      targetDate.setMinutes(Number(selectedMinute));

      if (targetDate < now) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
    }

    const timestamp = Math.floor(targetDate.getTime() / 1000);

    if (timestamp <= Math.floor(Date.now() / 1000)) {
      alert('예약 시간이 현재 시간보다 과거일 수 없습니다. 시간을 다시 설정해주세요.');
      setIsSubmitting(false);
      return;
    }

    const reservationBefore = new Date(targetDate.getTime() - 3 * 60 * 1000);
    const reservationBeforeTimestamp = Math.floor(reservationBefore.getTime() / 1000);

    const successBefore = await scheduleSlackMessage(`${selectedMessage} 3분 전`, reservationBeforeTimestamp);
    const successOnTime = await scheduleSlackMessage(selectedMessage, timestamp);
    const slackMentionsSuccess = await sendToSlackMentions(timestamp);

    if (successBefore && successOnTime && slackMentionsSuccess) {
      alert('성공적으로 예약되었습니다.');
      await fetchData();
    } else {
      alert('알 수 없는 사유로 알람 예약에 실패했습니다. 아리를 호출하세요.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className={styles.notification}>
      <div className={styles.alarm}>
        <h3>⌚️ 알람을 설정해요</h3>
        <ul>
          <li>알람 기능은 Slack 앱에서 이용 가능합니다.</li>
          <li>이용을 원하는 동생, 언니, 오빠들은 아리에게 이메일 주소를 알려주세요. slack 초대장을 보내드려요.</li>
          <li>Slack은 모바일, PC 둘 다 지원합니다. 업무 컴에 설치해서 알람을 놓치는 일이 없게 하세요.</li>
          <li>
            <strong>이메일만 알려주고 방치하면 알람을 받을 수 없습니다.</strong>
          </li>
          <li>
            <strong>
              은밀회수는 남은시간으로 입력되기 때문에 1분 정도 앞당겨서 설정하세요. (설정완료 누른 시점이 기준)
            </strong>
          </li>
        </ul>
        {slackMentions.length > 0 && (
          <div className={styles.table}>
            <table>
              <thead>
                <tr>
                  <th scope="col">지휘관</th>
                  <th scope="col">알람 시간</th>
                  <th scope="col">알람 종류</th>
                </tr>
              </thead>
              <tbody>
                {slackMentions.map((mention, index) => {
                  const date = new Date(mention.postAt);
                  const now = new Date();

                  let remainingDate;
                  if (mention.message === '은밀회수') {
                    const remainingTime = date.getTime() - now.getTime();
                    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
                    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                    remainingDate = `${hours}시간 ${minutes}분 남음`;
                  }
                  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: 'Asia/Seoul',
                  }).format(date);
                  return (
                    <tr key={index}>
                      <td>{mention.userName}</td>
                      <td>
                        {formattedDate}
                        {mention.message === '은밀회수' && <strong>{remainingDate}</strong>}
                      </td>
                      <td>{mention.message}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <form className={styles.form} onSubmit={sendScheduledMention}>
          <fieldset>
            <legend>알람 설정폼</legend>
            <div className={styles.selectors}>
              <div className={styles.selector}>
                <select
                  id="userSelect"
                  value={`${selectedUser}|${selectedUserName}`}
                  onChange={(e) => {
                    const [userId, userName] = e.target.value.split('|');
                    setSelectedUser(userId);
                    setSelectedUserName(userName);
                  }}
                  disabled={isSubmitting}
                >
                  <option value="">지휘관 선택</option>
                  {users.map((user, index) => (
                    <option key={index} value={`${user.id}|${user.name}`}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.selector}>
                <select
                  id="messageSelect"
                  value={selectedMessage}
                  onChange={(e) => setSelectedMessage(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">알람 종류 선택</option>
                  {messages.map((message) => (
                    <option key={message.value} value={message.value}>
                      {message.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.selectors}>{handleTimeSelect()}</div>
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

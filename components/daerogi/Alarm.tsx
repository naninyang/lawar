import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import styles from '@/styles/Daerogi.module.sass';

interface MentionAttributes {
  id: number;
  attributes: {
    userName: string;
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

interface Props {
  slackMentions: MentionAttributes[];
  slackUserIds: UserAttributes[];
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
      const mentionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slackMention`);
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

  const users = slackUserIds.map((user) => ({
    name: user.attributes.userName,
    id: user.attributes.userId,
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

  const sendScheduledMention = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUser === '' || selectedMessage === '' || selectedHour === '' || selectedMinute === '') {
      alert('항목 하나라도 선택하지 않으면 설정을 완료할 수 없어요. :(');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const selectedTime = new Date();
    selectedTime.setHours(Number(selectedHour), Number(selectedMinute), 0, 0);

    let targetDate = new Date(selectedTime);

    if (selectedTime < now) {
      targetDate.setDate(targetDate.getDate() + 1);
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
      alert('알 수 없는 사유로 알림 예약에 실패했습니다. 아리를 호출하세요.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className={styles.notification}>
      <div className={styles.alarm}>
        <h3>⌚️ 알람을 설정해요</h3>
        <ul>
          <li>현재 시간에서 5분 뒤부터 알람 설정이 가능합니다.</li>
          <li>e.g) 현재 시각이 11시 2분이라면 11시 7분 부터 설정 가능.</li>
          <li>알람을 맞추면 알람이 2번 갑니다. 설정된 시간과 설정된 시간 3분전.</li>
          <li>알람 기능은 Slack 앱에서 이용 가능합니다.</li>
          <li>Slack은 모바일, PC 둘 다 지원합니다. 애플 앱스토어 및 구글 플레이에서 slack을 검색하세요.</li>
          <li>이용을 원하는 동생, 언니, 오빠들은 아리에게 slack의 멤버 ID값을 카톡으로 전달하세요.</li>
          <li>부캐도 알람을 원하는 경우 본캐, 부캐 캐릭터 이름과 slack 멤버 ID 모두 카톡으로 전달하면 됩니다.</li>
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
                        <td>{mention.attributes.userName}</td>
                        <td>{formattedDate}</td>
                        <td>{mention.attributes.message}</td>
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
                  <option value="">알림 종류 선택</option>
                  {messages.map((message) => (
                    <option key={message.value} value={message.value}>
                      {message.label}
                    </option>
                  ))}
                </select>
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

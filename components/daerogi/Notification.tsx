import { useEffect, useState } from 'react';
import styles from '@/styles/Daerogi.module.sass';

interface MentionAttributes {
  id: number;
  documentId: string;
  userId: string;
  userName: string;
  messageBefore: string;
  message: string;
  postAt: string;
}

interface UserAttributes {
  id: number;
  documentId: string;
  userName: string;
  userId: string;
}

type Member = {
  id: string;
  name: string;
  realName: string;
};

export default function Notification() {
  const [members, setMembers] = useState<Member[]>([]);
  const [slackUser, setSlackUser] = useState<UserAttributes[]>([]);
  const [userName, setUserName] = useState('');

  const [slackMentions, setSlackMentions] = useState<MentionAttributes[]>([]);
  const [slackUserIds, setSlackUserIds] = useState<UserAttributes[]>([]);
  const [reservedMessage, setReservedMessage] = useState('');
  const [reservedBeforeMessage, setReservedBeforeMessage] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchMembers() {
    try {
      const membersResponse = await fetch('/api/slackMembers');
      const membersData = await membersResponse.json();
      setMembers(membersData.members);
      const usersResponse = await fetch('/api/slackUser');
      const usersData = await usersResponse.json();
      setSlackUser(usersData.data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchNotiData = async () => {
    try {
      const mentionResponse = await fetch(`/api/slackMentionForAll`);
      const mentionData = await mentionResponse.json();
      setSlackMentions(mentionData.data);

      const userIdsResponse = await fetch(`/api/slackIds`);
      const userIdsData = await userIdsResponse.json();
      setSlackUserIds(userIdsData.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchNotiData();
  }, []);

  const handlePrimarySubmit = async (e: React.FormEvent, memberId: string) => {
    e.preventDefault();

    try {
      const userIdResponse = await fetch('/api/slackIds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: memberId,
          userName,
        }),
      });

      const userIdsResponse = await fetch('/api/slackUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: memberId,
          userName,
        }),
      });

      if (!userIdsResponse.ok) {
        throw new Error('메인 ID 추가 실패');
      }

      if (!userIdResponse.ok) {
        throw new Error('유저 추가 실패');
      }

      alert('사용자가 추가되었습니다.');
      await fetchMembers();
    } catch (error) {
      console.error('Error:', error);
    }
  };

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

  const mentions = slackUserIds.map((user) => `<@${user.userId}>`).join(' ');
  const scheduleSlackMessage = async (messageText: string, timestamp: number) => {
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

  const users = slackUserIds.map((user) => `@${user.userName}`).join(' ');
  const sendToSlackMentions = async (reservedBeforeMessage: string, reservedMessage: string, timestamp: number) => {
    const response = await fetch('/api/slackMentionForAll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: mentions,
        userName: users,
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
    const slackMentionsSuccess = await sendToSlackMentions(reservedBeforeMessage, reservedMessage, timestamp);

    if (successBefore && successOnTime && slackMentionsSuccess) {
      alert('성공적으로 예약되었습니다.');
      await fetchNotiData();
    } else {
      alert('알람 예약에 실패했습니다.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className={`${styles.notification} ${styles.notifications}`}>
      <div className={styles.members}>
        <h3>멤버 관리</h3>
        {members && slackUser ? (
          <dl>
            {members.map((member) => {
              if (['Slackbot', 'Statuspage', 'last_daerogi', 'lawar_games'].includes(member.realName)) {
                return null;
              }
              return (
                <div key={member.id} className={styles.member}>
                  <div className={styles.basic}>
                    <dt>설정이름</dt>
                    <dd>{member.realName}</dd>
                    <dt>이메일ID</dt>
                    <dd>{member.name}</dd>
                    <dt>멤버ID</dt>
                    <dd>{member.id}</dd>
                  </div>
                  <div className={styles.settings}>
                    <dt>API 추가여부</dt>
                    <dd>
                      {slackUser.filter((user) => user.userId === member.id).length > 0 ? (
                        slackUser
                          .filter((user) => user.userId === member.id)
                          .map((user) => <span key={user.id}>{user.userName}</span>)
                      ) : (
                        <>
                          <strong>추가안됨</strong>
                          <form onSubmit={(e) => handlePrimarySubmit(e, member.id)}>
                            <fieldset>
                              <input
                                type="text"
                                placeholder="이름 입력"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                              />
                              <button type="submit">추가하기</button>
                            </fieldset>
                          </form>
                        </>
                      )}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        ) : (
          <p>로딩 중. 쫌만 기다려 아리야!</p>
        )}
      </div>
      <div className={styles.alarm}>
        <h3>단체 알람</h3>
        <div className={styles.dl}>
          <dl>
            {slackMentions
              .filter((mention) => new Date(mention.postAt) >= new Date())
              .sort((a, b) => new Date(a.postAt).getTime() - new Date(b.postAt).getTime())
              .map((mention, index) => {
                const date = new Date(mention.postAt);
                const formattedDate = new Intl.DateTimeFormat('ko-KR', {
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                  timeZone: 'Asia/Seoul',
                }).format(date);
                return (
                  <div key={index}>
                    <div>
                      <dt>알람 시간</dt>
                      <dd>{formattedDate}</dd>
                    </div>
                    <div>
                      <dt>대상자 ID</dt>
                      <dd>{mention.userId}</dd>
                    </div>
                    <div>
                      <dt>대상자 캐릭터</dt>
                      <dd>{mention.userName}</dd>
                    </div>
                    <div>
                      <dt>3분전 메시지</dt>
                      <dd>{mention.messageBefore}</dd>
                    </div>
                    <div>
                      <dt>시작 메시지</dt>
                      <dd>{mention.message}</dd>
                    </div>
                  </div>
                );
              })}
          </dl>
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

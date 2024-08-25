import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { nowTimeState } from '@/atoms/timeState';
import { Theme } from '@/pages/showdown';
import styles from '@/styles/Showdown.module.sass';

export default function ShowdownAll({
  competitions,
  matchingThemes,
}: {
  competitions: Theme[];
  matchingThemes: { [key: number]: string[] };
}) {
  const nowTime = useRecoilValue(nowTimeState);
  const [displayCompetitions, setDisplayCompetitions] = useState<Theme[]>([]);

  useEffect(() => {
    if (competitions.length > 0) {
      setDisplayCompetitions(competitions);
    }
  }, [competitions]);

  return (
    <div className={styles.contents}>
      <h2>전체 보기</h2>
      {displayCompetitions.map((competition, index) => (
        <div key={index} className={matchingThemes[1]?.includes(competition.name) ? styles.active : undefined}>
          <h3>
            {competition.name} - {index + 1}일차
          </h3>
          <dl>
            {competition.rewards.map((reward, idx) => (
              <div key={idx}>
                <dt>{reward.item}</dt>
                <dd>{reward.reward}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

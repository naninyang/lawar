import React from 'react';
import AllianceToday from './AllianceToday';
import AllianceTomorrow from './AllianceTomorrow';
import ArmsToday from './ArmsToday';
import ArmsTomorrow from './ArmsTomorrow';
import styles from '@/styles/Showdown.module.sass';

export default function ShowdownToday() {
  return (
    <div className={styles.contents}>
      <section>
        <AllianceToday />
        <ArmsToday />
      </section>
      <section>
        <AllianceTomorrow />
        <ArmsTomorrow />
      </section>
    </div>
  );
}

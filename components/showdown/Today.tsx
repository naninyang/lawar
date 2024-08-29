import React from 'react';
import { Theme } from '@/pages/showdown';
import AllianceToday from './Current/AllianceToday';
import AllianceTomorrow from './Current/AllianceTomorrow';
import ArmsToday from './Current/ArmsToday';
import ArmsTomorrow from './Current/ArmsTomorrow';
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

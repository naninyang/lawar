import React from 'react';
import { Theme } from '@/pages/showdown';
import AllianceToday from './Current/AllianceToday';
import AllianceTomorrow from './Current/AllianceTomorrow';
import ArmsToday from './Current/ArmsToday';
import ArmsTomorrow from './Current/ArmsTomorrow';
import styles from '@/styles/Showdown.module.sass';

export default function ShowdownToday({
  competitions,
  matchingThemes,
}: {
  competitions: Theme[];
  matchingThemes: { [key: number]: string[] };
}) {
  return (
    <div className={styles.contents}>
      <section>
        <AllianceToday />
        <ArmsToday competitions={competitions} matchingThemes={matchingThemes} />
      </section>
      <section>
        <AllianceTomorrow />
        <ArmsTomorrow competitions={competitions} matchingThemes={matchingThemes} />
      </section>
    </div>
  );
}

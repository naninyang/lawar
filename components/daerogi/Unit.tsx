import { useState } from 'react';
import styles from '@/styles/Daerogi.module.sass';

const units = ['기본', 'K', 'M', 'G'];

const unitMultipliers: { [key: string]: number } = {
  기본: 1,
  K: 1_000,
  M: 1_000_000,
  G: 1_000_000_000,
};

const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

export default function Unit() {
  const [unitValue, setUnitValue] = useState<string>('');
  const [unit, setUnit] = useState<string>('기본');
  const [results, setResults] = useState<{ [key: string]: string | null }>({
    기본: null,
    K: null,
    M: null,
    G: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(Number(value))) {
      setUnitValue(formatNumber(Number(value)));
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUnit(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawValue = parseFloat(unitValue.replace(/,/g, ''));
    if (!isNaN(rawValue)) {
      const baseValue = rawValue * unitMultipliers[unit];

      const newResults: { [key: string]: string | null } = {};
      for (const u of units) {
        const convertedValue = baseValue / unitMultipliers[u];
        newResults[u] = formatNumber(convertedValue);
      }
      setResults(newResults);
    }
  };

  return (
    <div className={styles.units}>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>값 입력 폼</legend>
          <div className={styles.group}>
            <label>숫자 입력</label>
            <div className={styles.value}>
              <input type="text" placeholder="숫자 입력" value={unitValue} onChange={handleInputChange} />
            </div>
            <div className={styles.selectbox}>
              <select value={unit} onChange={handleUnitChange}>
                {units.map((unitOption) => (
                  <option key={unitOption} value={unitOption}>
                    {unitOption}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.button}>
              <button type="submit">계산하기</button>
            </div>
          </div>
        </fieldset>
      </form>
      {results['기본'] && (
        <dl>
          <div className={styles.default}>
            <dt>입력한 값</dt>
            <dd>
              {unitValue} {unit !== '기본' && unit}
            </dd>
          </div>
          <div>
            <dt>계산된 값</dt>
            <dd>
              {results['K'] !== '0' && unit !== 'K' && <strong>{results['K']} K</strong>}
              {results['M'] !== '0' && unit !== 'M' && <strong>{results['M']} M</strong>}
              {results['G'] !== '0' && unit !== 'G' && <strong>{results['G']} G</strong>}
            </dd>
          </div>
        </dl>
      )}
    </div>
  );
}

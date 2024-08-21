import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseData = [
    { level: '10 👉 11', building: '베리어', time: '7.4 시간', steel: '1.9 M', gold: '600 K' },
    { level: '11 👉 12', building: '병영', time: '9.6 시간', steel: '3.2 M', gold: '1 M' },
    { level: '12 👉 13', building: '탱크센터', time: '12.5 시간', steel: '3.5 M', gold: '1.1 M' },
    { level: '13 👉 14', building: '연병장', time: '16.2 시간', steel: '4.9 M', gold: '1.6 M' },
    { level: '14 👉 15', building: '베리어', time: '22.7 시간', steel: '6.8 M', gold: '2.2 M' },
    { level: '15 👉 16', building: '연맹센터', time: '1.3 일', steel: '12 M', gold: '3.9 M' },
    { level: '16 👉 17', building: '탱크센터', time: '1.8 일', steel: '16 M', gold: '5.1 M' },
    { level: '17 👉 18', building: '병원', time: '2.6 일', steel: '28 M', gold: '8.9 M' },
    { level: '18 👉 19', building: '베리어', time: '3.6 일', steel: '33 M', gold: '11 M' },
    { level: '19 👉 20', building: '병영', time: '5.1 일', steel: '60 M', gold: '19 M' },
    { level: '20 👉 21', building: '탱크센터', time: '6.6 일', steel: '84 M', gold: '27 M' },
    { level: '21 👉 22', building: '연병장', time: '8.6 일', steel: '110 M', gold: '35 M' },
    { level: '22 👉 23', building: '베리어', time: '11.1 일', steel: '140 M', gold: '44 M' },
    { level: '23 👉 24', building: '연맹센터', time: '15.6 일', steel: '170 M', gold: '54 M' },
    { level: '24 👉 25', building: '탱크센터', time: '21.9 일', steel: '290 M', gold: '93 M' },
    { level: '25 👉 26', building: '병원', time: '30.6 일', steel: '400 M', gold: '130 M' },
    { level: '26 👉 27', building: '베리어', time: '42.9 일', steel: '530 M', gold: '170 M' },
    { level: '27 👉 28', building: '병영', time: '60.1 일', steel: '740 M', gold: '240 M' },
    { level: '28 👉 29', building: '탱크센터', time: '78.1 일', steel: '1 G', gold: '330 M' },
    { level: '29 👉 30', building: '연병장', time: '101.6 일', steel: '1.4 G', gold: '460 M' },
  ];

  res.status(200).json(baseData);
}

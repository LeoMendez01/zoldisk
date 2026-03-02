export const zodiacSigns = [
  { name: 'Aries', icon: '♈', start: [3, 21], end: [4, 19] },
  { name: 'Tauro', icon: '♉', start: [4, 20], end: [5, 20] },
  { name: 'Géminis', icon: '♊', start: [5, 21], end: [6, 20] },
  { name: 'Cáncer', icon: '♋', start: [6, 21], end: [7, 22] },
  { name: 'Leo', icon: '♌', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', icon: '♍', start: [8, 23], end: [9, 22] },
  { name: 'Libra', icon: '♎', start: [9, 23], end: [10, 22] },
  { name: 'Escorpio', icon: '♏', start: [10, 23], end: [11, 21] },
  { name: 'Sagitario', icon: '♐', start: [11, 22], end: [12, 21] },
  { name: 'Capricornio', icon: '♑', start: [12, 22], end: [1, 19] },
  { name: 'Acuario', icon: '♒', start: [1, 20], end: [2, 18] },
  { name: 'Piscis', icon: '♓', start: [2, 19], end: [3, 20] }
] as const;

const zodiacAffinity: Record<string, string[]> = {
  Aries: ['Leo', 'Sagitario', 'Géminis'],
  Tauro: ['Virgo', 'Capricornio', 'Cáncer'],
  'Géminis': ['Libra', 'Acuario', 'Aries'],
  'Cáncer': ['Escorpio', 'Piscis', 'Tauro'],
  Leo: ['Aries', 'Sagitario', 'Libra'],
  Virgo: ['Tauro', 'Capricornio', 'Cáncer'],
  Libra: ['Géminis', 'Acuario', 'Leo'],
  Escorpio: ['Cáncer', 'Piscis', 'Virgo'],
  Sagitario: ['Aries', 'Leo', 'Acuario'],
  Capricornio: ['Tauro', 'Virgo', 'Escorpio'],
  Acuario: ['Géminis', 'Libra', 'Sagitario'],
  Piscis: ['Cáncer', 'Escorpio', 'Capricornio']
};

export function getZodiacSign(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;

  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (startMonth <= endMonth) {
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (month > startMonth && month < endMonth)
      ) {
        return sign.name;
      }
    } else {
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        month > startMonth ||
        month < endMonth
      ) {
        return sign.name;
      }
    }
  }

  return 'Aries';
}

export function zodiacScore(signA: string, signB: string): number {
  if (signA === signB) return 1;
  const highAffinity = zodiacAffinity[signA] || [];
  if (highAffinity.includes(signB)) return 0.85;
  return 0.55;
}

export function zodiacIcon(signName: string): string {
  return zodiacSigns.find((s) => s.name === signName)?.icon ?? '✨';
}

import { UserProfile } from './types';
import { zodiacScore } from './zodiac';

function preferenceAlignment(a: UserProfile, b: UserProfile): number {
  const ids = Object.keys(a.answers).filter((id) => id in b.answers);
  if (!ids.length) return 0;

  let totalWeighted = 0;
  let totalWeight = 0;

  for (const id of ids) {
    const wa = 1;
    const maxDistance = 9;
    const diff = Math.abs(a.answers[id] - b.answers[id]);
    const normalized = 1 - diff / maxDistance;
    totalWeighted += normalized * wa;
    totalWeight += wa;
  }

  return totalWeight ? totalWeighted / totalWeight : 0;
}

function intentCompatibility(a: UserProfile, b: UserProfile): number {
  if (a.connectionType !== b.connectionType) return 0.3;

  const aAcceptsB = a.seeking === 'ambos' || a.seeking === b.gender;
  const bAcceptsA = b.seeking === 'ambos' || b.seeking === a.gender;

  if (aAcceptsB && bAcceptsA) return 1;
  if (aAcceptsB || bAcceptsA) return 0.65;
  return 0.35;
}

function nationalityBridge(a: UserProfile, b: UserProfile): number {
  if (a.nationality.trim().toLowerCase() === b.nationality.trim().toLowerCase()) return 1;
  return 0.75;
}

export function calculateCompatibility(a: UserProfile, b: UserProfile): {
  score: number;
  details: { zodiac: number; preferences: number; intent: number; nationality: number };
} {
  const z = zodiacScore(a.zodiac, b.zodiac);
  const p = preferenceAlignment(a, b);
  const i = intentCompatibility(a, b);
  const n = nationalityBridge(a, b);

  const score = z * 0.2 + p * 0.5 + i * 0.2 + n * 0.1;

  return {
    score: Math.round(score * 100),
    details: { zodiac: z, preferences: p, intent: i, nationality: n }
  };
}

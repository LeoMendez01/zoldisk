export type Gender = 'hombre' | 'mujer' | 'otro';
export type Seeking = 'hombre' | 'mujer' | 'ambos';
export type ConnectionType = 'amistad' | 'pareja' | 'trabajo';

export type Question = {
  id: string;
  text: string;
  options: string[];
  weight: number;
};

export type UserProfile = {
  name: string;
  birthDate: Date;
  zodiac: string;
  gender: Gender;
  seeking: Seeking;
  connectionType: ConnectionType;
  nationality: string;
  answers: Record<string, number>;
};

import { ConnectionType, Question } from './types';

const scale10 = [
  'Nada',
  'Muy bajo',
  'Bajo',
  'Algo bajo',
  'Medio-bajo',
  'Medio',
  'Medio-alto',
  'Alto',
  'Muy alto',
  'Totalmente'
];

const commonQuestions: Question[] = [
  { id: 'social', text: '¿Qué tan social eres?', options: scale10, weight: 1.1 },
  { id: 'routine', text: '¿Cuánto valoras una rutina estable?', options: scale10, weight: 1.0 },
  { id: 'adventure', text: '¿Qué tanto disfrutas nuevas experiencias?', options: scale10, weight: 1.0 }
];

const byConnection: Record<ConnectionType, Question[]> = {
  amistad: [
    { id: 'friend_time', text: '¿Cuánto tiempo semanal dedicas a amistades?', options: scale10, weight: 1.2 },
    { id: 'friend_humor', text: '¿Qué tan importante es compartir sentido del humor?', options: scale10, weight: 1.3 },
    { id: 'friend_loyalty', text: '¿Qué tan importante es la lealtad para ti?', options: scale10, weight: 1.3 }
  ],
  pareja: [
    { id: 'love_affection', text: '¿Qué tan importante es mostrar afecto diario?', options: scale10, weight: 1.3 },
    { id: 'love_projects', text: '¿Qué tan importante es planear proyectos de vida en común?', options: scale10, weight: 1.3 },
    { id: 'love_communication', text: '¿Qué tanto valoras la comunicación emocional profunda?', options: scale10, weight: 1.4 }
  ],
  trabajo: [
    { id: 'work_leadership', text: '¿Qué tan cómodo te sientes liderando equipos?', options: scale10, weight: 1.3 },
    { id: 'work_process', text: '¿Qué tanto prefieres procesos definidos?', options: scale10, weight: 1.2 },
    { id: 'work_results', text: '¿Qué tan orientado estás a resultados medibles?', options: scale10, weight: 1.4 }
  ]
};

export function getQuestions(type: ConnectionType): Question[] {
  return [...commonQuestions, ...byConnection[type]];
}

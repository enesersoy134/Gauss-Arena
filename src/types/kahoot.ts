import { Question } from './game';

export interface KahootPlayer {
  id: string;
  name: string;
  avatarUrl: string;
  score: number;
  streak: number;
  correctCount: number;
  wrongCount: number;
  hasAnsweredCurrent: boolean;
  lastRoundPoints: number;
  lastRoundCorrect: boolean;
  lastRoundTimeMs: number;
}

export interface KahootRoomState {
  pin: string;
  status: 'LOBBY' | 'QUESTION' | 'INTERMISSION' | 'FINISHED';
  examType: string;
  subjects: string[];
  currentQuestionIndex: number;
  totalQuestions: number;
  questionStartedAt: number;
  durationMs: number;
  currentQuestion: Question | null;
  answeredCount: number;
  totalPlayers: number;
  leaderboard: KahootPlayer[];
}

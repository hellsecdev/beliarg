

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export enum Difficulty {
  ASH = 'ASH',         // Easy
  EMBER = 'EMBER',     // Medium
  INFERNO = 'INFERNO' // Hard
}

export interface Sigil {
  id: string;
  title: string;
  color: string; // hex or preset name
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  originalDescription?: string; 
  deadline: string; 
  difficulty: Difficulty;
  isCompleted: boolean;
  createdAt: number;
  completedAt?: number;
  subtasks?: Subtask[];
  sigilId?: string;
}

export interface Ritual {
  id: string;
  title: string;
  streak: number;
  lastPerformed: number; // timestamp
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  sigilId?: string;
}

export enum TransactionType {
  TRIBUTE = 'TRIBUTE', // Income
  SACRIFICE = 'SACRIFICE' // Expense
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  sigilId?: string;
}

export type ParticleEffectType = 'fire' | 'soul' | 'void' | 'blood' | 'gold';

export interface PlayerStats {
  soulsCollected: number;
  gold: number;
  unlockedEffects: ParticleEffectType[];
  activeEffect?: ParticleEffectType;
}

export interface Altar {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
}

export type AppView = 'active' | 'history' | 'finance' | 'analytics' | 'grimoire';
export type Language = 'ru' | 'en' | 'he';
export type Theme = 'light' | 'dark';
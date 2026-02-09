/**
 * LocalStorage implementation of StorageAdapter
 * Future-proof: Easy to swap for Supabase/backend later
 */

import type { GameSettings, HandResult, StorageAdapter } from '../game/types';

const STORAGE_KEYS = {
  SETTINGS: 'blackjack_settings',
  HISTORY: 'blackjack_history',
} as const;

export class LocalStorageAdapter implements StorageAdapter {
  async saveSettings(settings: GameSettings): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  async loadSettings(): Promise<GameSettings | null> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  }

  async saveHistory(history: HandResult[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }

  async loadHistory(): Promise<HandResult[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  }

  async clearHistory(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }
}

export const storage = new LocalStorageAdapter();

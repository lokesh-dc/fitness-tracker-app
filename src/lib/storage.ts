import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionExercise } from '../types/workout';

const ACTIVE_SESSION_KEY = 'fittrack_active_session';

interface PersistedSession {
  workoutName: string;
  splitName: string;
  exercises: SessionExercise[];
  startedAt: string | null;
  bodyWeight: string;
  lastUpdated: number;
}

export const SessionStorage = {
  async saveSession(session: PersistedSession) {
    try {
      await AsyncStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  },

  async getSession(): Promise<PersistedSession | null> {
    try {
      const data = await AsyncStorage.getItem(ACTIVE_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to get session:', e);
      return null;
    }
  },

  async clearSession() {
    try {
      await AsyncStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
  }
};

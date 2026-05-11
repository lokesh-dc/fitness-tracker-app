import { SaveWorkoutPayload } from '../../types/workout';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export async function saveWorkoutSession(
  payload: SaveWorkoutPayload,
  authToken: string
): Promise<{ success: boolean; workoutLogId?: string; error?: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/workout/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error ?? 'Save failed' };
    }

    return { success: true, workoutLogId: data.workoutLogId };
  } catch (error) {
    console.error('saveWorkoutSession network error:', error);
    return { success: false, error: 'Network error — check your connection' };
  }
}

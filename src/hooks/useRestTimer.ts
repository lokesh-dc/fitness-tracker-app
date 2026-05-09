import { useState, useRef, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false, // Don't show the banner when app is open
    shouldPlaySound: true,  // Fallback to notification sound if app sound isn't ready
    shouldSetBadge: false,
  }),
});

// Safety check for notification module
const hasNotificationModule = !!Notifications?.getPermissionsAsync;

interface RestTimerState {
  isActive: boolean;
  secondsRemaining: number;
  totalSeconds: number;
}

interface UseRestTimerReturn {
  isActive: boolean;
  secondsRemaining: number;
  totalSeconds: number;
  startTimer: (durationSeconds: number) => void;
  skipTimer: () => void;
  adjustTimer: (deltaSeconds: number) => void;
}

export function useRestTimer(): UseRestTimerReturn {
  const [state, setState] = useState<RestTimerState>({
    isActive: false,
    secondsRemaining: 0,
    totalSeconds: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (hasNotificationModule) {
      await Notifications.cancelScheduledNotificationAsync('rest-timer').catch(() => { });
    }
  }, []);

  const skipTimer = useCallback(async () => {
    await clearTimer();
    setState({
      isActive: false,
      secondsRemaining: 0,
      totalSeconds: 0,
    });
  }, [clearTimer]);

  const startTimer = useCallback(async (duration: number) => {
    await clearTimer();

    if (hasNotificationModule) {
      try {
        // Notification permissions
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          await Notifications.requestPermissionsAsync();
        }

        // Schedule notification
        await Notifications.scheduleNotificationAsync({
          identifier: 'rest-timer',
          content: {
            title: 'Rest complete',
            body: "Time to crush the next set 💪",
            sound: true,
            priority: Notifications.AndroidImportance.MAX,
          },
          trigger: { 
            seconds: duration,
            type: 'timeInterval' as any
          } as any,
        });
      } catch (e) {
        console.warn('Notifications failed to start:', e);
      }
    }

    setState({
      isActive: true,
      secondsRemaining: duration,
      totalSeconds: duration,
    });

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.secondsRemaining <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return {
            ...prev,
            isActive: false,
            secondsRemaining: 0,
          };
        }
        return {
          ...prev,
          secondsRemaining: prev.secondsRemaining - 1,
        };
      });
    }, 1000);
  }, [clearTimer]);

  // Handle side effects on completion (sound, notification cleanup)
  useEffect(() => {
    if (!state.isActive && state.totalSeconds > 0 && state.secondsRemaining === 0) {
      // 1. Auto-dismiss the notification after 10 seconds
      if (hasNotificationModule) {
        setTimeout(() => {
          Notifications.dismissNotificationAsync('rest-timer').catch(() => { });
        }, 10000);
      }

      // 2. Play sound logic (Commented out until native rebuild is performed)
      /*
      try {
        const { Audio } = require('expo-av');
        Audio.Sound.createAsync(
          { uri: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' },
          { shouldPlay: true }
        ).then(({ sound }) => {
          sound.playAsync();
          sound.setOnPlaybackStatusUpdate((s) => { if (s.didJustFinish) sound.unloadAsync(); });
        });
      } catch (e) {}
      */
    }
  }, [state.isActive, state.secondsRemaining, state.totalSeconds]);

  const adjustTimer = useCallback(async (delta: number) => {
    setState((prev) => {
      const newRemaining = Math.min(Math.max(prev.secondsRemaining + delta, 10), 300);

      if (hasNotificationModule) {
        // Reschedule notification
        Notifications.cancelScheduledNotificationAsync('rest-timer').then(() => {
          if (newRemaining > 0) {
            Notifications.scheduleNotificationAsync({
              identifier: 'rest-timer',
              content: {
                title: 'Rest complete',
                body: "Time to crush the next set 💪",
                sound: true,
                priority: Notifications.AndroidImportance.MAX,
              },
              trigger: {
                seconds: newRemaining,
                type: 'timeInterval' as any
              } as any,
            }).catch(() => { });
          }
        }).catch(() => { });
      }

      return {
        ...prev,
        secondsRemaining: newRemaining,
      };
    });
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (hasNotificationModule) {
        Notifications.cancelScheduledNotificationAsync('rest-timer').catch(() => { });
      }
    };
  }, []);

  return {
    ...state,
    startTimer,
    skipTimer,
    adjustTimer,
  };
}

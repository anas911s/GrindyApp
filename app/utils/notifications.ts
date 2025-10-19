import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Task } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false })
});

export async function initNotificationsAsync() {
  try {
    if (!Device.isDevice) return;
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') { console.warn('No notif permission'); return; }
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('grindy-default', {
        name: 'Grindy reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#0EA5A4'
      });
    }
  } catch (e) { console.warn(e); }
}

export async function scheduleReminderForTask(task: Task): Promise<string | null> {
  try {
    if (!task.scheduledAt) return null;
    const date = new Date(task.scheduledAt);
    if (isNaN(date.getTime())) return null;
    if (date.getTime() <= Date.now()) date.setTime(Date.now() + 60 * 1000);
    const content = { title: `🔔 ${task.title}`, body: task.notes ?? 'Reminder — keep your streak!', data: { taskId: task.id } };
    const id = await Notifications.scheduleNotificationAsync({ content, trigger: date } as any);
    return id;
  } catch (e) { console.warn(e); return null; }
}

export async function cancelReminder(notificationId?: string | null) {
  try { if (!notificationId) return; await Notifications.cancelScheduledNotificationAsync(notificationId); } catch (e) { console.warn(e); }
}

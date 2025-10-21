import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Task } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,

    // 👇 Nieuwe velden toegevoegd in SDK 53+
    shouldShowBanner: true, // iOS: toon banner
    shouldShowList: true,   // iOS: toon in Notification Center
  }),
});


export async function initNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      console.warn('Notifications only work on a real device');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('No notification permission');
      return;
    }

    // Android: notificatiekanaal vereist
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#0EA5A4',
      });
    }
  } catch (err) {
    console.warn('initNotificationsAsync error:', err);
  }
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

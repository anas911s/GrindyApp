// app/utils/export.ts
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { loadJSON } from './storage';

export async function exportTasksAsJSON() {
  const tasks = await loadJSON('@grindy:tasks_v2') || [];
  const payload = JSON.stringify({ exportedAt: new Date().toISOString(), tasks }, null, 2);

  const path = `${FileSystem.documentDirectory}grindy-export-${Date.now()}.json`;

  await FileSystem.writeAsStringAsync(path, payload, { encoding: FileSystem.EncodingType.UTF8 });

  if (!(await Sharing.isAvailableAsync())) {
    console.warn('Sharing is not available on this platform');
    return path;
  }

  await Sharing.shareAsync(path, { mimeType: 'application/json' });
  return path;
}

export async function exportTasksAsCSV() {
  const tasks = await loadJSON('@grindy:tasks_v2') || [];
  const rows = [['id','title','completed','createdAt','scheduledAt','note']];
  tasks.forEach((t:any) => rows.push([
    t.id,
    (t.title||'').replace(/,/g,' '),
    t.completed ? '1' : '0',
    t.createdAt || '',
    t.scheduledAt || '',
    (t.note||'').replace(/,/g,' ')
  ]));

  const csv = rows.map(r => r.join(',')).join('\n');
  const path = `${FileSystem.documentDirectory}grindy-export-${Date.now()}.csv`;

  await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });

  if (!(await Sharing.isAvailableAsync())) {
    console.warn('Sharing is not available on this platform');
    return path;
  }

  await Sharing.shareAsync(path, { mimeType: 'text/csv' });
  return path;
}

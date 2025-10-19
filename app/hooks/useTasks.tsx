// app/hooks/useTasks.tsx
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import * as Network from 'expo-network';
import { loadJSON, saveJSON } from '../utils/storage';
import { scheduleReminderForTask, cancelReminder, initNotificationsAsync } from '../utils/notifications';
import { syncQueuedChanges } from '../utils/sync';
import type { Task, Change } from '../types';

const KEY = '@grindy:tasks_v2';
const QUEUE_KEY = '@grindy:sync_queue_v1';
const UNDO_KEY = '@grindy:undo_stack_v1';
const STREAK_KEY = '@grindy:streak_v1';
const LOCAL_VERSION_FIELD = '__local_version';

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}

export type ChangeOp = 'create' | 'update' | 'delete';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [lastStreakDate, setLastStreakDate] = useState<string | null>(null);

  const queueRef = useRef<Change[]>([]);
  const undoRef = useRef<any[]>([]);
  const onlineRef = useRef<boolean>(true);

  /** Boot sequence */
  useEffect(() => {
    (async () => {
      try {
        await initNotificationsAsync();

        // load tasks
        const loaded = await loadJSON<Task[]>(KEY);
        setTasks(Array.isArray(loaded) ? loaded : []);

        // load queue
        const q = await loadJSON<Change[]>(QUEUE_KEY);
        queueRef.current = Array.isArray(q) ? q : [];

        // load undo
        const u = await loadJSON<any[]>(UNDO_KEY);
        undoRef.current = Array.isArray(u) ? u : [];

        const s = await loadJSON<{ streak: number; last: string | null }>(STREAK_KEY);
        if (s) {
          setStreak(s.streak ?? 0);
          setLastStreakDate(s.last ?? null);
        }
      } catch (e) {
        console.warn('[useTasks] init error', e);
      } finally {
        setLoading(false);
      }
    })();

    /** Network polling using expo-network */
    const interval = setInterval(async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        const nowOnline = state.isConnected && state.isInternetReachable;
        if (nowOnline && !onlineRef.current) {
          flushQueue();
        }
        onlineRef.current = nowOnline;
      } catch (e) {
        console.warn('[useTasks] network check failed', e);
      }
    }, 5000); // check elke 5 seconden

    return () => clearInterval(interval);
  }, []);

  /** Persist tasks on change */
  useEffect(() => {
    (async () => {
      if (!loading) {
        try { await saveJSON(KEY, tasks); } 
        catch (e) { console.warn('[useTasks] save tasks error', e); }
      }
    })();
  }, [tasks, loading]);

  /** Persist queue */
  const saveQueue = useCallback(async () => {
    try { await saveJSON(QUEUE_KEY, queueRef.current); } 
    catch (e) { console.warn('[useTasks] saveQueue error', e); }
  }, []);

  /** Persist undo */
  const saveUndo = useCallback(async () => {
    try { await saveJSON(UNDO_KEY, undoRef.current); } 
    catch (e) { console.warn('[useTasks] saveUndo error', e); }
  }, []);

  /** Queue operations */
  const pushToQueue = useCallback((change: Change) => {
    queueRef.current.unshift(change);
    saveQueue();
    if (onlineRef.current) flushQueue();
  }, [saveQueue]);

  const flushQueue = useCallback(async () => {
    if (!queueRef.current.length) return;
    try {
      await syncQueuedChanges(queueRef.current);
      queueRef.current = [];
      await saveQueue();
    } catch (e) {
      console.warn('[useTasks] flushQueue failed', e);
    }
  }, [saveQueue]);

  /** Task operations */
  const addTask = useCallback(async (payload: Omit<Task, 'id' | 'createdAt' | 'completed' | 'notificationId' | typeof LOCAL_VERSION_FIELD>) => {
    const id = generateId();
    const createdAt = new Date().toISOString();
    const newTask: Task = { ...payload, id, createdAt, completed: false, notificationId: null, [LOCAL_VERSION_FIELD]: 1 } as any;

    if ((newTask as any).scheduledAt) {
      try {
        const nid = await scheduleReminderForTask(newTask);
        newTask.notificationId = nid;
      } catch (e) { console.warn('[useTasks] schedule failed', e); }
    }

    setTasks(prev => [newTask, ...prev]);
    pushToQueue({ op: 'create', id, payload: newTask, ts: Date.now() });
    undoRef.current.unshift({ type: 'create', task: newTask, ts: Date.now() });
    if (undoRef.current.length > 20) undoRef.current.pop();
    saveUndo();

    return newTask;
  }, [pushToQueue, saveUndo]);

  const updateTask = useCallback(async (id: string, patch: Partial<Task>) => {
    const prev = tasks.find(t => t.id === id);
    if (!prev) return null;

    undoRef.current.unshift({ type: 'update', before: prev, ts: Date.now() });
    if (undoRef.current.length > 20) undoRef.current.pop();
    saveUndo();

    setTasks(prevArr => prevArr.map(t => t.id === id ? { ...t, ...patch, [LOCAL_VERSION_FIELD]: ((t as any)[LOCAL_VERSION_FIELD] || 1) + 1 } : t));

    if ((patch as any).scheduledAt !== undefined) {
      if (prev.notificationId && !patch.scheduledAt) {
        try { await cancelReminder(prev.notificationId); } catch (e) { console.warn(e); }
      }
      if ((patch as any).scheduledAt) {
        const updated = { ...prev, ...patch };
        try {
          const nid = await scheduleReminderForTask(updated);
          setTasks(prevArr => prevArr.map(t => t.id === id ? { ...t, notificationId: nid } : t));
        } catch (e) { console.warn('[useTasks] schedule update failed', e); }
      }
    }

    pushToQueue({ op: 'update', id, payload: patch, ts: Date.now() });
    return true;
  }, [tasks, pushToQueue, saveUndo]);

  const removeTask = useCallback(async (id: string) => {
    const found = tasks.find(t => t.id === id);
    if (!found) return;

    undoRef.current.unshift({ type: 'delete', task: found, ts: Date.now() });
    if (undoRef.current.length > 20) undoRef.current.pop();
    saveUndo();

    if (found.notificationId) {
      try { await cancelReminder(found.notificationId); } catch (e) { console.warn(e); }
    }

    setTasks(prev => prev.filter(t => t.id !== id));
    pushToQueue({ op: 'delete', id, payload: null, ts: Date.now() });
  }, [tasks, pushToQueue, saveUndo]);

  const undo = useCallback(async () => {
    const entry = undoRef.current.shift();
    if (!entry) return null;
    try {
      if (entry.type === 'create') setTasks(prev => prev.filter(t => t.id !== entry.task.id));
      if (entry.type === 'update') setTasks(prev => prev.map(t => t.id === entry.before.id ? entry.before : t));
      if (entry.type === 'delete') setTasks(prev => [entry.task, ...prev]);

      if (entry.type === 'create') pushToQueue({ op: 'delete', id: entry.task.id, payload: null, ts: Date.now() });
      if (entry.type === 'update') pushToQueue({ op: 'update', id: entry.before.id, payload: entry.before, ts: Date.now() });
      if (entry.type === 'delete') pushToQueue({ op: 'create', id: entry.task.id, payload: entry.task, ts: Date.now() });

      await saveUndo();
    } catch (e) {
      console.warn('[useTasks] undo failed', e);
    }
    return entry;
  }, [pushToQueue, saveUndo]);

  const clearAll = useCallback(async () => {
    const ids = tasks.map(t => t.id);
    ids.forEach(id => pushToQueue({ op: 'delete', id, payload: null, ts: Date.now() }));
    setTasks([]);
  }, [tasks, pushToQueue]);

  return useMemo(() => ({
    tasks, loading, streak, lastStreakDate,
    addTask, updateTask, removeTask, undo, clearAll, flushQueue
  }), [tasks, loading, streak, lastStreakDate, addTask, updateTask, removeTask, undo, clearAll, flushQueue]);
}

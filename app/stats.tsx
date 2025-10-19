import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTasks } from './hooks/useTasks';
import { theme } from './utils/theme';
import { format } from 'date-fns';

export default function Stats() {
  const { tasks, streak } = useTasks();
  const completedCount = tasks.filter(t => t.completed).length;
  const total = tasks.length;

  const perDay = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach(t => {
      const day = format(new Date(t.createdAt), 'yyyy-MM-dd');
      map[day] = (map[day] || 0) + (t.completed ? 1 : 0);
    });
    return map;
  }, [tasks]);

  const days = Object.keys(perDay).sort((a,b)=>b.localeCompare(a)).slice(0,14);

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Stats</Text>
      <Text style={styles.stat}>✅ Completed: {completedCount}</Text>
      <Text style={styles.stat}>🗂️ Total tasks: {total}</Text>
      <Text style={styles.stat}>🔥 Current streak: {streak}</Text>

      <View style={{ marginTop: 16 }}>
        <Text style={styles.sub}>Recent completion</Text>
        {days.map(d => <Text key={d} style={styles.day}>{d} — {perDay[d] ?? 0} done</Text>)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, paddingHorizontal:20, paddingTop:24, backgroundColor: theme.colors.background },
  h1: { fontSize: 28, fontWeight: '800', color: theme.colors.text },
  stat: { marginTop: 12, fontSize: 16, color: theme.colors.text, fontWeight: '600' },
  sub: { marginTop: 8, color: theme.colors.subtext },
  day: { marginTop: 6, color: theme.colors.text }
});

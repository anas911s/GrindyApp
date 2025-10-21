import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTasks } from './hooks/useTasks';
import { theme } from './utils/theme';
import { format } from 'date-fns';
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";


export default function Stats({ darkMode = false }: { darkMode?: boolean }) {
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

  const colors = darkMode ? theme.dark.colors : theme.light.colors;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.h1, { color: colors.text }]}>Stats</Text>
      <Text style={[styles.stat, { color: colors.text }]}>✅ Completed: {completedCount}</Text>
      <Text style={[styles.stat, { color: colors.text }]}>🗂️ Total tasks: {total}</Text>
      <Text style={[styles.stat, { color: colors.text }]}>🔥 Current streak: {streak}</Text>

      <View style={{ marginTop: 16 }}>
        <Text style={[styles.sub, { color: colors.subtext }]}>Recent completion</Text>
        {days.map(d => <Text key={d} style={[styles.day, { color: colors.text }]}>{d} — {perDay[d] ?? 0} done</Text>)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      paddingHorizontal: responsiveWidth(5),
      paddingTop: responsiveHeight(10),
      paddingBottom: responsiveHeight(1),
    },
  h1: { fontSize: 28, fontWeight: '800' },
  stat: { marginTop: 12, fontSize: 16, fontWeight: '600' },
  sub: { marginTop: 8 },
  day: { marginTop: 6 }
});

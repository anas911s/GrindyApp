// app/components/WeeklySummary.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTasks } from '../hooks/useTasks';
import moment from 'moment';

export default function WeeklySummary() {
  const { tasks } = useTasks();

  const summary = useMemo(() => {
    const days = Array.from({length:7}, (_,i)=>moment().subtract(i,'days').format('YYYY-MM-DD')).reverse();
    const counts = days.map(d => tasks.filter(t => t.completed && t.updatedAt && t.updatedAt.startsWith(d)).length);
    return { days, counts };
  }, [tasks]);

  const bestDayIndex = summary.counts.indexOf(Math.max(...summary.counts));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekoverzicht</Text>
      <View style={styles.row}>
        {summary.days.map((d, i)=>(
          <View key={d} style={[styles.cell, {opacity: Math.min(1, 0.2 + (summary.counts[i]||0) * 0.2)}]}>
            <Text style={styles.cellLabel}>{d.slice(5)}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.note}>Productiefste dag: {summary.days[bestDayIndex]?.slice(5) || '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  title: { fontWeight:'800', fontSize:16, marginBottom:8 },
  row: { flexDirection:'row', justifyContent:'space-between' },
  cell: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#0b84ff', justifyContent:'center', alignItems:'center' },
  cellLabel: { fontSize:10, color:'#fff' },
  note: { marginTop:8, color:'#666' }
});

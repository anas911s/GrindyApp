import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTasks } from './hooks/useTasks';
import TaskCard from './components/TaskCard';
import { theme } from './utils/theme';

export default function Agenda() {
  const { tasks, loading, toggleComplete, removeTask } = useTasks();
  const scheduled = tasks.filter(t => t.scheduledAt).sort((a,b) => (a.scheduledAt! > b.scheduledAt! ? 1 : -1));

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Agenda</Text>
      <Text style={styles.sub}>Planned tasks</Text>

      {loading ? <Text style={{marginTop:20}}>Loading…</Text> : (
        <FlatList data={scheduled} keyExtractor={i => i.id} renderItem={({item}) => <TaskCard task={item} onToggle={toggleComplete} onDelete={removeTask} />} ListEmptyComponent={<Text style={{marginTop:30,color:theme.colors.subtext}}>No scheduled tasks</Text>} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 24, backgroundColor: theme.colors.background },
  h1: { fontSize: 28, fontWeight: '800', color: theme.colors.text },
  sub: { fontSize: 13, color: theme.colors.subtext, marginTop: 6 }
});

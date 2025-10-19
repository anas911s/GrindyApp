import React, { useMemo, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useTasks } from './hooks/useTasks';
import TaskCard from './components/TaskCard';
import QuickAddSheet from './components/QuickAddSheet';
import TaskDetailSheet from './components/TaskDetailSheet';
import { format } from 'date-fns';
import { theme } from './utils/theme';
import * as Haptics from 'expo-haptics';

export default function Home() {
  const { tasks, loading, addTask, removeTask, toggleComplete, addSubtask, streak } = useTasks();
  const [detailTask, setDetailTask] = useState<string | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const todayTasks = useMemo(() => {
    const unscheduled = tasks.filter(t => !t.scheduledAt);
    const scheduled = tasks.filter(t => t.scheduledAt).sort((a,b) => (a.scheduledAt! > b.scheduledAt! ? 1 : -1));
    return [...unscheduled, ...scheduled];
  }, [tasks]);

  const handleQuickAdd = async (title: string, notes?: string) => {
    await addTask({ title, notes, scheduledAt: null, priority: 'medium' });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const openDetail = (taskId: string) => { setDetailTask(taskId); setDetailVisible(true); };
  const currentTask = tasks.find(t => t.id === detailTask) ?? null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.h1}>Grindy</Text>
        <Text style={styles.sub}>{format(new Date(), 'EEEE, dd LLL')}</Text>
        <Text style={styles.streak}>🔥 Streak: {streak}</Text>
      </View>

      {/* Quick Add */}
      <QuickAddSheet onAdd={handleQuickAdd} />

      {/* Task List */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.accent} style={{marginTop:40}} />
      ) : (
        <FlatList
          data={todayTasks}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggle={toggleComplete}
              onDelete={removeTask}
              onPress={() => openDetail(item.id)}
            />
          )}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingBottom: 140 }}
          ListEmptyComponent={
            <Text style={{textAlign:'center', marginTop:40, color: theme.colors.subtext}}>
              No tasks yet — add one!
            </Text>
          }
        />
      )}

      {/* Task Detail Modal */}
      <TaskDetailSheet
        visible={detailVisible}
        task={currentTask}
        onClose={() => setDetailVisible(false)}
        onSave={async (id, patch) => { await (await import('./hooks/useTasks')).updateTask?.(id, patch); }}
        onDelete={removeTask}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 },
  h1: { fontSize: 34, fontWeight: '800', color: theme.colors.text },
  sub: { fontSize: 14, color: theme.colors.subtext, marginTop: 4 },
  streak: { marginTop: 8, color: theme.colors.accent, fontWeight: '700' },
});

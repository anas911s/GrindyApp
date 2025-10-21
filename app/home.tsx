import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useTasks } from './hooks/useTasks';
import TaskCard from './components/TaskCard';
import QuickAddSheet from './components/QuickAddSheet';
import TaskDetailSheet from './components/TaskDetailSheet';
import { format } from 'date-fns';
import { theme } from './utils/theme';
import * as Haptics from 'expo-haptics';
import { useTheme } from './components/themeContext';
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";


export default function Home() {
  const { tasks, loading, addTask, removeTask, toggleComplete, streak } = useTasks();
  const [detailTask, setDetailTask] = useState<string | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [quickAddVisible, setQuickAddVisible] = useState(false);
  const { darkMode } = useTheme();
  const colors = darkMode ? theme.dark.colors : theme.light.colors;

  const todayTasks = useMemo(() => tasks.filter(t => !t.archived), [tasks]);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: quickAddVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [quickAddVisible]);

  const handleQuickAdd = (title: string, notes?: string) => {
    addTask({title, notes});
    Haptics.selectionAsync();
  };

  const openDetail = (taskId: string) => {
    setDetailTask(taskId);
    setDetailVisible(true);
  };

  const currentTask = tasks.find(t => t.id === detailTask) ?? null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.sub, { color: colors.subtext }]}>{format(new Date(), 'EEEE, dd LLL')}</Text>
        <Text style={[styles.streak, { color: colors.accent }]}>🔥 Streak: {streak}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={todayTasks}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggle={toggleComplete}
              onDelete={removeTask}
              onPress={openDetail}
            />
          )}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
        />
      )}

      {/* ✅ OF een plus-knop OF de sheet */}
      {!quickAddVisible && (
        <TouchableOpacity
          onPress={() => setQuickAddVisible(true)}
          style={[styles.fab, { backgroundColor: colors.accent }]}
          activeOpacity={0.85}
        >
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      )}

      {quickAddVisible && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <QuickAddSheet onAdd={handleQuickAdd} onClose={() => setQuickAddVisible(false)} />
        </Animated.View>
      )}

      <TaskDetailSheet
        visible={detailVisible}
        task={currentTask}
        onClose={() => setDetailVisible(false)}
        onSave={() => {}}
        onDelete={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {     
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(10),
    paddingBottom: responsiveHeight(1),
  },
  sub: { fontSize: 14, marginTop: 4 },
  streak: { marginTop: 8, fontWeight: '700' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  plus: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '600',
    marginBottom: 2,
  },
});

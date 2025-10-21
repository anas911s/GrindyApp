import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTasks } from './hooks/useTasks';
import TaskCard from './components/TaskCard';
import { theme } from './utils/theme';
import { useTheme } from './components/themeContext';
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";


export default function Agenda() {
  const { tasks, loading, toggleComplete, removeTask } = useTasks();
  const { darkMode } = useTheme();
  const colors = darkMode ? theme.dark.colors : theme.light.colors;

  const scheduled = tasks
    .filter(t => t.scheduledAt)
    .sort((a, b) => (a.scheduledAt! > b.scheduledAt! ? 1 : -1));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={scheduled}
        keyExtractor={t => t.id}
        renderItem={({ item }) => <TaskCard task={item} onToggle={toggleComplete} onDelete={removeTask} />}
        ListEmptyComponent={<Text style={{ color: colors.subtext, padding: 20 }}>No scheduled tasks</Text>}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(10),
    paddingBottom: responsiveHeight(1), 
  },
});

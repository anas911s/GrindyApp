import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { theme } from '../utils/theme';

type TaskCardProps = {
  task: { id: string; title: string; notes?: string; priority: 'low' | 'medium' | 'high'; completed?: boolean };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress?: () => void;
};

export default function TaskCard({ task, onToggle, onDelete, onPress }: TaskCardProps) {
  const priorityColor = task.priority === 'high' ? theme.colors.danger : task.priority === 'medium' ? theme.colors.accent : '#FACC15';
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.card, { borderLeftColor: priorityColor }]}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => onToggle(task.id)} style={styles.checkbox}>
          <View style={[styles.checkmark, task.completed && { backgroundColor: theme.colors.success }]} />
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={[styles.title, task.completed && { textDecorationLine: 'line-through', color: theme.colors.subtext }]}>{task.title}</Text>
          {task.notes ? <Text style={styles.notes}>{task.notes}</Text> : null}
        </View>
        <TouchableOpacity onPress={() => onDelete(task.id)}><Text style={{color: theme.colors.danger}}>🗑</Text></TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing * 2,
    marginHorizontal: theme.spacing * 2,
    marginVertical: theme.spacing,
    borderRadius: theme.borderRadius,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 24, height: 24, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  checkmark: { width: 16, height: 16, borderRadius: 4 },
  content: { flex: 1, marginLeft: theme.spacing },
  title: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  notes: { fontSize: 13, color: theme.colors.subtext, marginTop: 2 },
});

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { theme } from '../utils/theme';
import { useTheme } from './themeContext';

export type Task = {
  id: string;
  title: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
  archived?: boolean;
};

type TaskCardProps = {
  task: Task;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPress?: (id: string) => void;
  onChangePriority?: (id: string) => void;
};

export default function TaskCard({ task, onToggle, onDelete, onPress, onChangePriority }: TaskCardProps) {
  const { darkMode } = useTheme();
  const colors = darkMode ? theme.dark.colors : theme.light.colors;

  const animatedValue = useRef(new Animated.Value(task.completed ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: task.completed ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [task.completed]);

  const scale = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });

  const priorityColor =
    task.priority === 'high'
      ? colors.danger
      : task.priority === 'medium'
      ? colors.accent
      : task.priority === 'low'
      ? '#FACC15'
      : colors.border;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.container, { backgroundColor: colors.card, borderLeftColor: priorityColor }]}
      onPress={() => onPress && onPress(task.id)}
    >
      <View style={styles.row}>
        {/* Checkbox */}
        <TouchableOpacity
          onPress={() => onToggle && onToggle(task.id)}
          style={[
            styles.checkbox,
            {
              borderColor: task.completed ? colors.accent : colors.border,
              backgroundColor: task.completed ? colors.accent : 'transparent',
            },
          ]}
        >
          <Animated.View
            style={[styles.innerCheck, { transform: [{ scale }], opacity: animatedValue, backgroundColor: colors.card }]}
          />
        </TouchableOpacity>

        {/* Title & Notes */}
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              {
                color: task.completed ? colors.subtext : colors.text,
                textDecorationLine: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.6 : 1,
              },
            ]}
          >
            {task.title ?? ''}
          </Text>
          {task.notes ? <Text style={[styles.notes, { color: colors.subtext }]}>{task.notes}</Text> : null}
        </View>

        {/* Priority + Delete */}
        <View style={styles.rightBtns}>
          <TouchableOpacity
            onPress={() => onChangePriority && onChangePriority(task.id)}
            style={[styles.priorityBtn, { borderColor: priorityColor }]}
          >
            <Text style={{ color: priorityColor, fontWeight: '700' }}>
              {task.priority ? task.priority[0].toUpperCase() : '?'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onDelete && onDelete(task.id)} style={styles.deleteBtn}>
            <Text style={{ color: colors.subtext, fontSize: 18 }}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCheck: { width: 10, height: 10, borderRadius: 3 },
  content: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: '700' },
  notes: { fontSize: 13, marginTop: 4 },
  rightBtns: { flexDirection: 'row', alignItems: 'center' },
  priorityBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  deleteBtn: { padding: 8 },
});

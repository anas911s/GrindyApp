import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Task } from '../types';
import { theme } from '../utils/theme';

type TaskDetailSheetProps = {
  visible: boolean;
  task?: Task | null;
  onClose: () => void;
  onSave: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
  darkMode?: boolean;
};

export default function TaskDetailSheet({
  visible,
  task,
  onClose,
  onSave,
  onDelete,
  darkMode = false,
}: TaskDetailSheetProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [notes, setNotes] = useState(task?.notes ?? '');

  useEffect(() => {
    setTitle(task?.title ?? '');
    setNotes(task?.notes ?? '');
  }, [task]);

  if (!task) return null;

  const colors = darkMode ? theme.dark.colors : theme.light.colors;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.h1, { color: colors.text }]}>Edit Task</Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          placeholder="Task title"
          placeholderTextColor={colors.text + '88'}
        />

        <TextInput
          value={notes}
          onChangeText={setNotes}
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, height: 120 }]}
          multiline
          placeholder="Notes (optional)"
          placeholderTextColor={colors.text + '88'}
        />

        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <TouchableOpacity
            style={[styles.save, { backgroundColor: colors.accent }]}
            onPress={() => {
              onSave(task.id, { title, notes });
              onClose();
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.delete, { backgroundColor: colors.danger }]}
            onPress={() => {
              onDelete(task.id);
              onClose();
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  h1: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  input: { padding: 12, borderRadius: 10, marginTop: 8 },
  save: { padding: 12, borderRadius: 10, marginRight: 8, flex: 1, alignItems: 'center' },
  delete: { padding: 12, borderRadius: 10, flex: 1, alignItems: 'center' },
});

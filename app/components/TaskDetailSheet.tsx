import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Task } from '../types';
import { theme } from '../utils/theme';

export default function TaskDetailSheet({ visible, task, onClose, onSave, onDelete }: {
  visible: boolean;
  task?: Task | null;
  onClose: () => void;
  onSave: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [notes, setNotes] = useState(task?.notes ?? '');

  React.useEffect(() => {
    setTitle(task?.title ?? '');
    setNotes(task?.notes ?? '');
  }, [task]);

  if (!task) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView style={styles.container}>
        <Text style={styles.h1}>Edit task</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} />
        <TextInput value={notes} onChangeText={setNotes} style={[styles.input, { height: 120 }]} multiline />
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <TouchableOpacity style={styles.save} onPress={() => { onSave(task.id, { title, notes }); onClose(); }}>
            <Text style={{ color: '#fff' }}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.delete} onPress={() => { onDelete(task.id); onClose(); }}>
            <Text style={{ color: '#fff' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: theme.colors.background },
  h1: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  input: { backgroundColor: theme.colors.surface, padding: 12, borderRadius: 10, marginTop: 8 },
  save: { backgroundColor: theme.colors.accent, padding: 12, borderRadius: 10, marginRight: 8 },
  delete: { backgroundColor: theme.colors.danger, padding: 12, borderRadius: 10 }
});

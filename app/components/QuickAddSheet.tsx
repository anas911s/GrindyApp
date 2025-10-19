import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export default function QuickAddSheet({ onAdd }: { onAdd: (title: string, notes?: string) => void }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), notes.trim() || undefined);
    setTitle(''); setNotes('');
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Task title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Notes (optional)" value={notes} onChangeText={setNotes} style={[styles.input, styles.notes]} />
      <TouchableOpacity style={styles.btn} onPress={handleAdd}><Text style={styles.btnTxt}>Add</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: theme.colors.surface, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  input: { backgroundColor: '#f5f7f8', padding: 12, borderRadius: 10, marginBottom: 8 },
  notes: { height: 44 },
  btn: { backgroundColor: theme.colors.accent, padding: 12, borderRadius: 10, alignItems: 'center' },
  btnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' }
});

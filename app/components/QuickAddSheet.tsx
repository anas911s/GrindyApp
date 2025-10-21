import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../utils/theme';
import { useTheme } from './themeContext';

type Props = { onAdd: (title: string, notes: string) => void; onClose: () => void };

export default function QuickAddSheet({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const { darkMode } = useTheme();
  const colors = darkMode ? theme.dark.colors : theme.light.colors;

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), notes.trim());
    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={[styles.sheet, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={[styles.closeText, { color: colors.subtext }]}>×</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Title"
          placeholderTextColor={colors.subtext}
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { color: colors.text }]}
        />
        <TextInput
          placeholder="Notes (optional)"
          placeholderTextColor={colors.subtext}
          value={notes}
          onChangeText={setNotes}
          style={[styles.input, { color: colors.text, marginTop: 8 }]}
        />
        <TouchableOpacity onPress={handleAdd} style={[styles.btn, { backgroundColor: colors.accent }]}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 20, width: '100%', alignItems: 'center' },
  sheet: {
    padding: 16,
    borderRadius: 14,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  input: { fontSize: 16, padding: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  btn: { marginTop: 12, padding: 12, borderRadius: 10, alignItems: 'center' },
  closeBtn: { position: 'absolute', right: 10, top: 6, zIndex: 2, padding: 6 },
  closeText: { fontSize: 22, fontWeight: '700' },
});

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../utils/theme';

type Props = { onAdd: (title: string, notes?: string) => void };

export default function FABQuickAdd({ onAdd }: Props) {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.sheet}>
        <TextInput placeholder="Add a new task" value={text} onChangeText={setText} style={styles.input} />
        <TouchableOpacity onPress={handleAdd} style={styles.btn}><Text style={{color:'#fff'}}>Add</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 20, width: '100%', alignItems: 'center' },
  sheet: { flexDirection: 'row', backgroundColor: theme.colors.card, padding: 12, borderRadius: theme.borderRadius, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3, width: '90%' },
  input: { flex: 1, marginRight: 8, fontSize: 16 },
  btn: { backgroundColor: theme.colors.accent, paddingHorizontal: 16, justifyContent: 'center', borderRadius: theme.borderRadius },
});

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../utils/theme';

type Props = { onAdd: (title: string, notes?: string) => void; darkMode?: boolean };

export default function FABQuickAdd({ onAdd, darkMode = false }: Props) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const colors = darkMode ? theme.dark.colors : theme.light.colors;

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), notes.trim() || undefined);
    setTitle('');
    setNotes('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={styles.container}>
      <View style={[styles.sheet, { backgroundColor: colors.card }]}>
        <TextInput placeholder="Task title" value={title} onChangeText={setTitle} placeholderTextColor={colors.subtext} style={[styles.input, { color: colors.text }]} />
        <TextInput placeholder="Notes (optional)" value={notes} onChangeText={setNotes} placeholderTextColor={colors.subtext} style={[styles.input, { color: colors.text, marginTop: 4 }]} />
        <TouchableOpacity onPress={handleAdd} style={[styles.btn, { backgroundColor: colors.accent }]}>
          <Text style={{ color:'#fff' }}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { position:'absolute', bottom:20, width:'100%', alignItems:'center' },
  sheet: { padding:12, borderRadius:16, width:'90%', shadowColor:'#000', shadowOpacity:0.05, shadowOffset:{width:0,height:2}, shadowRadius:4, elevation:3 },
  input: { fontSize:16, padding:8, borderBottomWidth:1, borderBottomColor:'#ccc' },
  btn: { marginTop:8, padding:12, borderRadius:16, alignItems:'center' },
});

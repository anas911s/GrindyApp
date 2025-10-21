import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { theme } from './utils/theme';
import { saveJSON, loadJSON } from './utils/storage';

export default function Journal({ darkMode = false }: { darkMode?: boolean }) {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  const colors = darkMode ? theme.dark.colors : theme.light.colors;

  const save = async () => {
    const now = new Date().toISOString();
    const entry = { id: now, text, createdAt: now };
    const existing = (await loadJSON('journal_v1')) ?? [];
    await saveJSON('journal_v1', [entry, ...existing]);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
    setText('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.h1, { color: colors.text }]}>Reflection</Text>
      <Text style={[styles.sub, { color: colors.subtext }]}>Write a quick summary of your day</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        multiline
        style={[styles.input, { backgroundColor: darkMode ? '#2c2c2c' : '#fff', color: colors.text }]}
        placeholder="Today I..."
        placeholderTextColor={colors.text + '88'}
      />
      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.accent }]} onPress={save}>
        <Text style={{color:'#fff'}}>Save reflection</Text>
      </TouchableOpacity>
      {saved && <Text style={{marginTop:8,color:colors.accent}}>Saved — nice work</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20 },
  h1: { fontSize: 28, fontWeight:'800' },
  sub: { marginTop:6 },
  input: { marginTop:12, minHeight: 120, padding:12, borderRadius: 12, shadowColor:'#000', shadowOpacity:0.05, shadowOffset:{width:0,height:2}, shadowRadius:4, elevation:2 },
  btn: { marginTop: 12, padding: 12, borderRadius: 12, alignItems: 'center' }
});

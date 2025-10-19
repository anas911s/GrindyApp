import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { theme } from './utils/theme';
import { saveJSON, loadJSON } from './utils/storage';

export default function Journal() {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

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
    <View style={styles.container}>
      <Text style={styles.h1}>Reflection</Text>
      <Text style={styles.sub}>Write a quick summary of your day</Text>
      <TextInput value={text} onChangeText={setText} multiline style={styles.input} placeholder="Today I..." />
      <TouchableOpacity style={styles.btn} onPress={save}><Text style={{color:'#fff'}}>Save reflection</Text></TouchableOpacity>
      {saved && <Text style={{marginTop:8,color:theme.colors.accent}}>Saved — nice work</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor: theme.colors.background },
  h1: { fontSize: 28, fontWeight:'800', color: theme.colors.text },
  sub: { color: theme.colors.subtext, marginTop:6 },
  input: { marginTop:12, backgroundColor:'#fff', minHeight: 120, padding:12, borderRadius: 12, shadowColor:'#000', shadowOpacity:0.05, shadowOffset:{width:0,height:2}, shadowRadius:4, elevation:2 },
  btn: { marginTop: 12, backgroundColor: theme.colors.accent, padding: 12, borderRadius: 12, alignItems: 'center' }
});

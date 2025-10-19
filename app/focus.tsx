import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FocusTimer from './components/FocusTimer';
import { theme } from './utils/theme';

export default function Focus() {
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Focus mode</Text>
      <Text style={styles.sub}>25 minutes of deep focus</Text>
      <FocusTimer minutes={25} onFinish={() => { /* could trigger confetti or streak logic */ }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor: theme.colors.background },
  h1: { fontSize: 28, fontWeight:'800', color: theme.colors.text },
  sub: { color: theme.colors.subtext, marginTop:6 }
});

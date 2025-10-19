// app/components/ProgressBar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressBar({ percent }: { percent: number }) {
  const width = Math.max(0, Math.min(100, percent));
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${width}%` }]} />
      </View>
      <Text style={styles.label}>{Math.round(width)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center' },
  bar: { flex: 1, height: 8, backgroundColor: '#e6eefc', borderRadius: 999, overflow: 'hidden', marginRight: 8 },
  fill: { height: 8, backgroundColor: '#0b84ff' },
  label: { fontSize: 12, color: '#333', width: 36, textAlign: 'right' }
});

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export default function FocusTimer({ minutes = 25, onFinish, darkMode = false }: { minutes?: number; onFinish?: () => void; darkMode?: boolean }) {
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(minutes * 60);
  const intervalRef = useRef<number | null>(null);

  const colors = darkMode ? theme.dark.colors : theme.light.colors;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            onFinish?.();
            return 0;
          }
          return r - 1;
        });
      }, 1000) as unknown as number;
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = (remaining % 60).toString().padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={[styles.timer, { color: colors.text }]}>{mm}:{ss}</Text>
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.accent }]} onPress={() => setRunning(r => !r)}>
          <Text style={styles.btnTxt}>{running ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#888' }]} onPress={() => { setRunning(false); setRemaining(minutes * 60); }}>
          <Text style={styles.btnTxt}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 20 },
  timer: { fontSize: 56, fontWeight: '800' },
  btn: { padding: 12, borderRadius: 10, marginHorizontal: 8 },
  btnTxt: { color: '#fff', fontWeight: '700' }
});

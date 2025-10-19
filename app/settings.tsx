import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { theme } from './utils/theme';

export default function Settings() {
  const [notifs, setNotifs] = React.useState(true);
  const [dark, setDark] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Settings</Text>
      <View style={styles.row}><Text style={styles.label}>Notifications</Text><Switch value={notifs} onValueChange={setNotifs} /></View>
      <View style={styles.row}><Text style={styles.label}>Dark mode</Text><Switch value={dark} onValueChange={setDark} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor: theme.colors.background },
  h1: { fontSize: 28, fontWeight:'800', color: theme.colors.text },
  row: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:20 },
  label: { fontSize:16, color: theme.colors.text }
});

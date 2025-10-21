import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from './components/themeContext';
import { theme } from './utils/theme';
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifs, setNotifs] = React.useState(true);

  const colors = darkMode ? theme.dark.colors : theme.light.colors;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.h1, { color: colors.text }]}>Settings</Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Notifications</Text>
        <Switch value={notifs} onValueChange={setNotifs} />
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Dark mode</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,    
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(10),
    paddingBottom: responsiveHeight(1),},
  h1: { fontSize: 28, fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  label: { fontSize: 16 },
});

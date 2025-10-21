import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FocusTimer from './components/FocusTimer';
import { useTheme } from './components/themeContext';
import { theme } from './utils/theme';
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";


export default function FocusScreen() {
  const { darkMode } = useTheme();
  const colors = darkMode ? theme.dark.colors : theme.light.colors;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.h1, { color: colors.text }]}>Focus</Text>
      <FocusTimer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingHorizontal: responsiveWidth(5), // 5% van breedte
    paddingTop: responsiveHeight(10),
    paddingBottom: responsiveHeight(1),
  },
  h1: { fontSize: 28, fontWeight: '800' },
});

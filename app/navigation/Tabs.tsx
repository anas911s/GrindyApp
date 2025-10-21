import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../home';
import Agenda from '../agenda';
import StatsScreen from '../stats';
import FocusScreen from '../focus';
import SettingsScreen from '../settings';
import Ionicons from '@expo/vector-icons/Ionicons';
import { theme } from '../utils/theme';

const Tab = createBottomTabNavigator();

export default function Tabs({ darkMode = false }: { darkMode?: boolean }) {
  const colors = darkMode ? theme.dark.colors : theme.light.colors;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: '#CBD5E1',
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          elevation: 10,
          height: 90,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'list-outline';
              break;
            case 'Agenda':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Stats':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'Focus':
              iconName = focused ? 'timer' : 'timer-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
          }

          return <Ionicons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Agenda" component={Agenda} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Focus" component={FocusScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

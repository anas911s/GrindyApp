import React, { useEffect } from 'react';
import Tabs from './navigation/Tabs';
import { ThemeProvider } from './components/themeContext';
import { initNotificationsAsync } from './utils/notifications';

export default function App() {
  useEffect(() => {
    initNotificationsAsync();
  }, []);

  return (
    <ThemeProvider>
      <Tabs />
    </ThemeProvider>
  );
}

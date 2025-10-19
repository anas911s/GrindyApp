// app/_layout.tsx
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { loadJSON, saveJSON } from '../app/utils/storage';
import Onboarding from '../app/components/Onboarding';
import App from '../app/index';

export default function RootLayout() {
  const [seen, setSeen] = useState<boolean | null>(null);

  // Laad onboarding flag
  useEffect(() => {
    (async () => {
      const s = await loadJSON<boolean>('@grindy:seen_onboarding_v1');
      setSeen(!!s);
    })();
  }, []);

  if (seen === null) return null; // laadscherm of niets tonen

  // Toon onboarding als niet gezien
  if (!seen) {
    return (
      <Onboarding
        onFinish={async () => {
          await saveJSON('@grindy:seen_onboarding_v1', true); // opslaan
          setSeen(true); // update state zodat RootLayout App toont
        }}
      />
    );
  }

  // Toon main app stack
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <App />
    </Stack>
  );
}

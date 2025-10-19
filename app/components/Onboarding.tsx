// app/components/Onboarding.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const STEPS = [
  {
    title: 'Welkom bij Grindy',
    subtitle: 'Focus. Build momentum. Finish what matters.',
    body: 'Maak taken aan, volg je streaks en laat Grindy je motiveren met slimme reminders en progress.',
    image: null
  },
  {
    title: 'Snel taken aanmaken',
    subtitle: 'Zero friction task creation',
    body: 'Een snelle taak? Swipe of druk op + en je bent klaar — subtasks en schema’s inbegrepen.',
    image: null
  },
  {
    title: 'Slimme reminders',
    subtitle: 'Herinneringen die werken',
    body: 'Krijg reminders gebaseerd op je ritme en plan en laat Grindy je resetten wanneer je vastloopt.',
    image: null
  },
  {
    title: 'Ga nu starten',
    subtitle: 'Klaar om te vlammen?',
    body: 'Je eerste taak staat klaar. Probeer één taak te maken — wij doen de rest.',
    image: null
  }
];

type OnboardingProps = {
  onFinish: () => void;
};

export default function Onboarding({ onFinish }: OnboardingProps) {
  const [i, setIndex] = useState(0);

  const next = () => {
    if (i < STEPS.length - 1) setIndex(prev => prev + 1);
    else onFinish();
  };

  const skip = () => onFinish();

  return (
    <View style={s.container} accessibilityLabel="Onboarding screen">
      <View style={s.content}>
        <Text style={s.title}>{STEPS[i].title}</Text>
        <Text style={s.subtitle}>{STEPS[i].subtitle}</Text>
        <Text style={s.body}>{STEPS[i].body}</Text>
      </View>

      <View style={s.footer}>
        <View style={s.dots}>
          {STEPS.map((_, idx) => (
            <View key={idx} style={[s.dot, idx === i ? s.dotActive : null]} />
          ))}
        </View>

        <View style={s.actions}>
          <TouchableOpacity accessibilityRole="button" onPress={skip}>
            <Text style={s.skip}>Overslaan</Text>
          </TouchableOpacity>

          <TouchableOpacity accessibilityRole="button" onPress={next} style={s.nextBtn}>
            <Text style={s.nextText}>{i === STEPS.length - 1 ? 'Start Grindy' : 'Volgende'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 24, justifyContent: 'space-between' },
  content: { marginTop: 60 },
  title: { fontSize: 32, fontWeight: '800', color: '#fff' },
  subtitle: { marginTop: 8, fontSize: 16, fontWeight: '600', color: '#9CA3AF' },
  body: { marginTop: 18, color: '#D1D5DB', fontSize: 15, lineHeight: 22 },

  footer: { paddingBottom: 40 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: '#374151', margin: 6 },
  dotActive: { backgroundColor: '#60A5FA', width: 18, borderRadius: 12 },

  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 6 },
  skip: { color: '#9CA3AF', fontWeight: '600' },
  nextBtn: { backgroundColor: '#60A5FA', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  nextText: { color: '#0F172A', fontWeight: '800' }
});

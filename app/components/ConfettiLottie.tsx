// app/components/ConfettiLottie.tsx
import React, { useRef, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';

export default function ConfettiLottie({ play = false } : { play?: boolean }) {
  const ref = useRef<LottieView | null>(null);

  useEffect(() => {
    if (play) {
      ref.current?.reset();
      ref.current?.play();
      // auto-stop handled in Lottie config (or stop after some seconds)
      setTimeout(()=>ref.current?.pause(), 3000);
    }
  }, [play]);

  return (
    <View pointerEvents="none" style={styles.container}>
      <LottieView ref={ref} source={require('../assets/lottie/confetti.json')} style={styles.lottie} loop={false} autoPlay={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position:'absolute', left:0, right:0, top:0, bottom:0, justifyContent:'center', alignItems:'center' },
  lottie: { width: 420, height: 420 }
});

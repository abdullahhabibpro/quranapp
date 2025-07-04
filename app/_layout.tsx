import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { SurahProvider } from '../context/SurahContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AudioProvider } from '../context/AudioContext';
import { store, persistor } from '../store/store';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AudioPlayer from '../components/AudioPlayer';
import * as Notifications from 'expo-notifications';
import { PersistGate } from 'redux-persist/lib/integration/react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'AmiriQuran': require('../assets/fonts/AmiriQuran.ttf'),
    'NotoNastaliqUrdu': require('../assets/fonts/NotoNastaliqUrdu.ttf'),
    'Scheherazade': require('../assets/fonts/Scheherazade.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
    // Request notification permissions
    Notifications.requestPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
      }
    });
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (fontError) {
    console.error('Font loading error:', fontError);
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<View style={styles.loadingContainer}><ActivityIndicator size="large" color="#4CAF50" /></View>} persistor={persistor}>
        <ThemeProvider>
          <SurahProvider>
            <AudioProvider>
              <StatusBar style="auto" />
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="surah/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="juz/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="settings" options={{ headerShown: false }} />
                <Stack.Screen name="bookmarks" options={{ headerShown: false }} />
                <Stack.Screen name="prayer-times" options={{ headerShown: false }} />
                <Stack.Screen name="qibla" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="dua" options={{ headerShown: false }} />
                <Stack.Screen name="downloads" options={{ headerShown: false }} />
              </Stack>
              <AudioPlayer />
            </AudioProvider>
          </SurahProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
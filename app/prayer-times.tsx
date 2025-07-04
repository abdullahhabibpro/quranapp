import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import * as Location from 'expo-location';
import LinearGradient from 'react-native-linear-gradient';

interface PrayerTime {
  name: string;
  time: string;
}

export default function PrayerTimesScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPrayerTimes([]);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(`${loc.coords.latitude}, ${loc.coords.longitude}`);
      
      // Example API call to Aladhan API
      fetch(`http://api.aladhan.com/v1/timings?latitude=${loc.coords.latitude}&longitude=${loc.coords.longitude}&method=2`)
        .then((res) => res.json())
        .then((data) => {
          const timings = data.data.timings;
          setPrayerTimes([
            { name: 'Fajr', time: timings.Fajr },
            { name: 'Dhuhr', time: timings.Dhuhr },
            { name: 'Asr', time: timings.Asr },
            { name: 'Maghrib', time: timings.Maghrib },
            { name: 'Isha', time: timings.Isha },
          ]);
        })
        .catch((error) => console.error('Error fetching prayer times:', error));
    })();
  }, []);

  const styles = createStyles(theme, insets);

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <Text style={[styles.headerText, { color: theme === 'dark' ? '#fff' : '#000' }]}>
          Prayer Times
        </Text>
        <Text style={[styles.locationText, { color: theme === 'dark' ? '#b0b0b0' : '#555' }]}>
          {location || 'Fetching location...'}
        </Text>
      </Animatable.View>
      <FlatList
        data={prayerTimes}
        renderItem={({ item }) => (
          <Animatable.View animation="fadeInUp" style={styles.card}>
            <LinearGradient
              colors={theme === 'dark' ? ['#1e1e1e', '#2a2a2a'] : ['#fff', '#f5f5f5']}
              style={styles.gradient}
            >
              <Text style={[styles.prayerName, { color: theme === 'dark' ? '#fff' : '#000' }]}>
                {item.name}
              </Text>
              <Text style={[styles.prayerTime, { color: theme === 'dark' ? '#b0b0b0' : '#555' }]}>
                {item.time}
              </Text>
            </LinearGradient>
          </Animatable.View>
        )}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const createStyles = (theme: 'light' | 'dark', insets: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
      paddingTop: insets.top,
    },
    header: {
      padding: 16,
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#333' : '#e0e0e0',
    },
    headerText: {
      fontSize: 24,
      fontWeight: '700',
      fontFamily: 'AmiriQuran',
    },
    locationText: {
      fontSize: 16,
      marginTop: 8,
    },
    list: {
      padding: 16,
    },
    card: {
      marginBottom: 12,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },
    gradient: {
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    prayerName: {
      fontSize: 18,
      fontWeight: '600',
    },
    prayerTime: {
      fontSize: 18,
    },
  });
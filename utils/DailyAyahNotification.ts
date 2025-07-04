import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setupDailyAyahNotification = async () => {
  const ayahs = await fetch('https://api.alquran.cloud/v1/ayah/random/en.sahih')
    .then((res) => res.json())
    .then((data) => ({
      arabic: data.data.text,
      translation: data.data.translation,
      surah: data.data.surah.englishName,
      ayah: data.data.numberInSurah,
    }));

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Daily Ayah: ${ayahs.surah} ${ayahs.ayah}`,
      body: `${ayahs.arabic}\n${ayahs.translation}`,
    },
    trigger: {
      hour: 8,
      minute: 0,
      repeats: true,
    },
  });
};

export const useDailyAyahNotification = () => {
  useEffect(() => {
    AsyncStorage.getItem('notificationsEnabled').then((value) => {
      if (value === 'true') {
        setupDailyAyahNotification();
      }
    });
  }, []);
};
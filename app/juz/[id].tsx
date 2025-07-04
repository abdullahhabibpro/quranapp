import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getJuzData, getJuzTrans } from '../../store/surahSlice';
import { useSurah } from '../../context/SurahContext';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import AyahCard from '../../components/AyahCard';
import Options from '../../components/Options';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function JuzScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [offlineData, setOfflineData] = useState(null);
  const { qari, trans } = useSurah();
  const { theme } = useTheme();
  const { playAudio, isPlaying, currentAyahIndex } = useAudio();
  const dispatch = useDispatch();
  const juz = useSelector((state: any) => state.surah.juzData);
  const translation = useSelector((state: any) => state.surah.juzTrans);
  const ayahs = juz?.ayahs || [];
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Check for offline data
        const cachedData = await AsyncStorage.getItem(`juz_${id}_${qari}_${trans}`);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          dispatch(getJuzData(parsed.juzData));
          dispatch(getJuzTrans(parsed.juzTrans));
          setOfflineData(parsed);
          setLoading(false);
          return;
        }

        // Fetch online data
        const juzResponse = await fetch(`https://api.alquran.cloud/v1/juz/${id}/${qari}`);
        const juzData = await juzResponse.json();
        dispatch(getJuzData(juzData.data));

        const transResponse = await fetch(`https://api.alquran.cloud/v1/juz/${id}/${trans}`);
        const transData = await transResponse.json();
        dispatch(getJuzTrans(transData.data));

        // Cache data
        await AsyncStorage.setItem(
          `juz_${id}_${qari}_${trans}`,
          JSON.stringify({ juzData: juzData.data, juzTrans: transData.data })
        );
        setLoading(false);
      } catch (error) {
        console.error('Error fetching juz:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [id, qari, trans, dispatch]);

  const styles = createStyles(theme, insets);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.juzName, { color: theme === 'dark' ? '#fff' : '#000' }]}>Juz {id}</Text>
        <Image source={require('../../assets/images/basmalah.png')} style={styles.basmalah} />
        <Options />
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {ayahs.map((ayah: any, idx: number) => (
          <AyahCard
            key={`${ayah.surah.number}-${ayah.numberInSurah}`}
            ayatNo={ayah.numberInSurah}
            arabic={ayah.text}
            translation={translation?.ayahs?.[idx]?.text || ''}
            audioQ={ayah.audio}
            index={idx}
            surahNumber={ayah.surah?.number}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: 'light' | 'dark', insets: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#fff',
      paddingTop: insets.top + 16,
    },
    header: {
      padding: 16,
      alignItems: 'center',
    },
    juzName: {
      fontSize: 32,
      fontWeight: 'bold',
      fontFamily: 'AmiriQuran',
      textAlign: 'center',
    },
    basmalah: {
      height: 40,
      width: '100%',
      marginVertical: 16,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 16,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#121212' : '#fff',
    },
    loadingText: {
      fontSize: 18,
      fontFamily: 'AmiriQuran',
    },
  });
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSurahData, getSurahTrans } from '../../store/surahSlice';
import { useSurah } from '../../context/SurahContext';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import AyahCard from '../../components/AyahCard';
import Options from '../../components/Options';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SurahScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [offlineData, setOfflineData] = useState(null);
  const { qari, trans } = useSurah();
  const { theme } = useTheme();
  const { playAudio, isPlaying, currentAyahIndex } = useAudio();
  const dispatch = useDispatch();
  const surah = useSelector((state: any) => state.surah.surahData);
  const translation = useSelector((state: any) => state.surah.surahTrans);
  const ayats = surah?.ayahs || [];
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Check for offline data
        const cachedData = await AsyncStorage.getItem(`surah_${id}_${qari}_${trans}`);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          dispatch(getSurahData(parsed.surahData));
          dispatch(getSurahTrans(parsed.surahTrans));
          setOfflineData(parsed);
          setLoading(false);
          return;
        }

        // Fetch online data
        const surahResponse = await fetch(`https://api.alquran.cloud/v1/surah/${id}/${qari}`);
        const surahData = await surahResponse.json();
        dispatch(getSurahData(surahData.data));

        const transResponse = await fetch(`https://api.alquran.cloud/v1/surah/${id}/${trans}`);
        const transData = await transResponse.json();
        dispatch(getSurahTrans(transData.data));

        // Cache data
        await AsyncStorage.setItem(
          `surah_${id}_${qari}_${trans}`,
          JSON.stringify({ surahData: surahData.data, surahTrans: transData.data })
        );
        setLoading(false);
      } catch (error) {
        console.error('Error fetching surah:', error);
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
        <Text style={[styles.surahName, { color: theme === 'dark' ? '#fff' : '#000' }]}>{surah?.name}</Text>
        {surah?.number !== 1 && (
          <Image source={require('../../assets/images/basmalah.png')} style={styles.basmalah} />
        )}
        <Options />
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {ayats.map((ayah: any, idx: number) => {
          const isFirstAyahNotFatiha = ayah.numberInSurah === 1 && surah?.number !== 1;
          const cleanedText = isFirstAyahNotFatiha
            ? ayah.text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/, '').trim()
            : ayah.text;
          return (
            <AyahCard
              key={ayah.number}
              ayatNo={ayah.numberInSurah}
              arabic={cleanedText}
              translation={translation?.ayahs?.[idx]?.text || ''}
              audioQ={ayah.audio}
              index={idx}
            />
          );
        })}
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
    surahName: {
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
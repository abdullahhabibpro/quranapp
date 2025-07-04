import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { useSurah } from '../context/SurahContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

interface AyahCardProps {
  arabic: string;
  ayatNo: string;
  translation: string;
  audioQ: string;
  index: number;
  surahNumber: number;
  tafsir?: string;
}

export default function AyahCard({
  arabic = '',
  ayatNo = '1',
  translation = '',
  audioQ = '',
  index = 0,
  surahNumber,
  tafsir = '',
}: AyahCardProps) {
  const { theme } = useTheme();
  const { audio, isPlaying, playAudio, currentAyahIndex } = useAudio();
  const { trans } = useSurah();
  const [showTrans, setShowTrans] = useState(true);
  const [showTafsir, setShowTafsir] = useState(false);
  const isUrdu = trans === 'ur.junagarhi';
  const cardRef = useRef(null);

  const styles = createStyles(theme);

  const handleAudio = async () => {
    if (!audioQ) return;
    await playAudio(audioQ, index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const copyToClipboard = async () => {
    const text = `${arabic}\n${translation}${showTafsir && tafsir ? `\nTafsir: ${tafsir}` : ''}`;
    await AsyncStorage.setItem('clipboard', text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert('Ayah copied to clipboard');
  };

  const bookmarkAyah = async () => {
    const bookmarks = JSON.parse((await AsyncStorage.getItem('bookmarks')) || '[]');
    const newBookmark = {
      surah: surahNumber,
      ayah: ayatNo,
      arabic,
      translation,
      tafsir,
      timestamp: new Date().toISOString(),
    };
    bookmarks.push(newBookmark);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert('Ayah bookmarked');
  };

  const panGesture = Gesture.Pan().onEnd((event) => {
    if (event.translationX > 50) {
      setShowTrans(!showTrans);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animatable.View
        ref={cardRef}
        animation={index === currentAyahIndex ? 'pulse' : undefined}
        style={styles.container}
      >
        <LinearGradient
          colors={theme === 'dark' ? ['#1e1e1e', '#2a2a2a'] : ['#fff', '#f5f5f5']}
          style={styles.gradient}
        >
          <View style={styles.arabicContainer}>
            <Text
              style={[
                styles.arabicText,
                { color: audioQ === audio && isPlaying ? '#4CAF50' : theme === 'dark' ? '#fff' : '#000' },
              ]}
            >
              {arabic} ({ayatNo})
            </Text>
          </View>
          {showTrans && (
            <Animatable.View animation="fadeIn" style={styles.translationContainer}>
              <Text style={[styles.translationText, { fontFamily: isUrdu ? 'NotoNastaliqUrdu' : 'AmiriQuran' }]}>
                {translation}
              </Text>
            </Animatable.View>
          )}
          {showTafsir && tafsir && (
            <Animatable.View animation="fadeIn" style={styles.tafsirContainer}>
              <Text style={[styles.tafsirText, { fontFamily: isUrdu ? 'NotoNastaliqUrdu' : 'AmiriQuran' }]}>
                Tafsir: {tafsir}
              </Text>
            </Animatable.View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleAudio}>
              <Icon
                name={audioQ === audio && isPlaying ? 'pause' : 'play-arrow'}
                size={20}
                color={theme === 'dark' ? '#fff' : '#000'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setShowTrans(!showTrans)}>
              <Icon
                name={showTrans ? 'visibility-off' : 'visibility'}
                size={20}
                color={theme === 'dark' ? '#fff' : '#000'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setShowTafsir(!showTafsir)}>
              <Icon name="book" size={20} color={theme === 'dark' ? '#fff' : '#000'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={copyToClipboard}>
              <Icon name="content-copy" size={20} color={theme === 'dark' ? '#fff' : '#000'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={bookmarkAyah}>
              <Icon name="bookmark" size={20} color={theme === 'dark' ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animatable.View>
    </GestureDetector>
  );
}

const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      marginVertical: 8,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },
    gradient: {
      padding: 20,
    },
    arabicContainer: {
      marginBottom: 16,
    },
    arabicText: {
      fontSize: 26,
      fontFamily: 'AmiriQuran',
      textAlign: 'right',
      lineHeight: 40,
    },
    translationContainer: {
      marginBottom: 16,
    },
    translationText: {
      fontSize: 18,
      color: theme === 'dark' ? '#b0b0b0' : '#555',
      lineHeight: 28,
    },
    tafsirContainer: {
      marginBottom: 16,
    },
    tafsirText: {
      fontSize: 16,
      color: theme === 'dark' ? '#999' : '#666',
      lineHeight: 24,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
    },
    button: {
      padding: 12,
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f0f0f0',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useRouter } from 'expo-router';

interface Bookmark {
  surah: number;
  ayah: string;
  arabic: string;
  translation: string;
  tafsir?: string;
  timestamp: string;
}

export default function BookmarksScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('bookmarks').then((value) => {
      if (value) setBookmarks(JSON.parse(value));
    });
  }, []);

  const deleteBookmark = async (index: number) => {
    const newBookmarks = bookmarks.filter((_, i) => i !== index);
    setBookmarks(newBookmarks);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  const styles = createStyles(theme, insets);

  const renderBookmark = ({ item, index }: { item: Bookmark; index: number }) => {
    const panGesture = Gesture.Pan().onEnd((event) => {
      if (event.translationX < -50) {
        deleteBookmark(index);
      }
    });

    return (
      <GestureDetector gesture={panGesture}>
        <Animatable.View animation="fadeInUp" style={styles.card}>
          <LinearGradient
            colors={theme === 'dark' ? ['#1e1e1e', '#2a2a2a'] : ['#fff', '#f5f5f5']}
            style={styles.gradient}
          >
            <TouchableOpacity onPress={() => router.push(`/surah/${item.surah}`)}>
              <Text style={[styles.arabicText, { color: theme === 'dark' ? '#fff' : '#000' }]}>
                {item.arabic} ({item.ayah})
              </Text>
              <Text style={[styles.translationText, { color: theme === 'dark' ? '#b0b0b0' : '#555' }]}>
                {item.translation}
              </Text>
              {item.tafsir && (
                <Text style={[styles.tafsirText, { color: theme === 'dark' ? '#999' : '#666' }]}>
                  Tafsir: {item.tafsir}
                </Text>
              )}
              <Text style={[styles.timestamp, { color: theme === 'dark' ? '#999' : '#666' }]}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteBookmark(index)}>
              <Icon name="delete" size={20} color="#ff4444" />
            </TouchableOpacity>
          </LinearGradient>
        </Animatable.View>
      </GestureDetector>
    );
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <Text style={[styles.headerText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Bookmarks</Text>
      </Animatable.View>
      <FlatList
        data={bookmarks}
        renderItem={renderBookmark}
        keyExtractor={(item, index) => `${item.surah}-${item.ayah}-${index}`}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme === 'dark' ? '#999' : '#666' }]}>
            No bookmarks yet
          </Text>
        }
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
    },
    arabicText: {
      fontSize: 22,
      fontFamily: 'AmiriQuran',
      textAlign: 'right',
      marginBottom: 8,
    },
    translationText: {
      fontSize: 16,
      marginBottom: 8,
    },
    tafsirText: {
      fontSize: 14,
      marginBottom: 8,
    },
    timestamp: {
      fontSize: 12,
    },
    deleteButton: {
      position: 'absolute',
      right: 16,
      top: 16,
      padding: 8,
    },
    emptyText: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 32,
    },
  });
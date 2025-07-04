import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSurahList } from '../store/surahSlice';
import SurahCard from '../components/SurahCard';
import SearchBar from '../components/SearchBar';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { MaterialIcons } from '@expo/vector-icons';
import SettingsModal from '../components/SettingsModal';

// Define types
type ContentType = 'surah' | 'juz';

interface SurahItem {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation?: string;
  numberOfAyahs: number;
}

interface JuzItem {
  number: number;
  name: string;
  englishName: string;
  meaning: string;
  ayatCount: number;
}

interface RootState {
  surah: {
    surahList: SurahItem[];
    loading: boolean;
    error: string | null;
  };
}

export default function HomeScreen() {
  const [currentType, setCurrentType] = useState<ContentType>('surah');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const { surahList, loading, error } = useSelector((state: RootState) => state.surah || { surahList: [], loading: false, error: null });
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const juz: JuzItem[] = Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    name: `Juz ${i + 1}`,
    englishName: `Juz ${i + 1}`,
    meaning: `Part ${i + 1}`,
    ayatCount: Math.floor(Math.random() * 200) + 100,
  }));

  const loadInitialData = useCallback(async () => {
    try {
      const recentSearchesValue = await AsyncStorage.getItem('recentSearches');
      if (recentSearchesValue) setRecentSearches(JSON.parse(recentSearchesValue));

      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      if (!onboardingCompleted && router) {
        setTimeout(() => router.push('/onboarding'), 100);
      }

      if (dispatch) dispatch(getSurahList() as any);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, router]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const filteredData = useMemo(() => {
    const currentData = currentType === 'surah' ? surahList : juz;
    if (!searchQuery) return currentData;

    const lowerQuery = searchQuery.toLowerCase();
    return currentData.filter((item: SurahItem | JuzItem) => {
      const matchesEnglishName = item.englishName?.toLowerCase().includes(lowerQuery);
      const matchesName = item.name?.toLowerCase().includes(lowerQuery);
      const matchesTranslation = 'englishNameTranslation' in item && item.englishNameTranslation?.toLowerCase().includes(lowerQuery);
      const matchesMeaning = 'meaning' in item && item.meaning?.toLowerCase().includes(lowerQuery);
      return matchesEnglishName || matchesName || matchesTranslation || matchesMeaning;
    });
  }, [searchQuery, surahList, juz, currentType]);

  const handleNavigation = useCallback((path: string) => {
    if (router) router.push(path);
  }, [router]);

  const styles = createStyles(theme, insets);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <View style={styles.headerTop}>
            <Text style={[styles.headerTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>
              Quran App
            </Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => setShowSettings(true)}>
                <MaterialIcons name="settings" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigation('/bookmarks')}>
                <MaterialIcons name="bookmark" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>
          </View>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            recentSearches={recentSearches}
            onSearch={setSearchQuery}
          />
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, currentType === 'surah' && styles.activeTab]}
              onPress={() => setCurrentType('surah')}
            >
              <Text style={[styles.tabText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Surahs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, currentType === 'juz' && styles.activeTab]}
              onPress={() => setCurrentType('juz')}
            >
              <Text style={[styles.tabText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Juz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {isLoading || loading ? (
        <SkeletonPlaceholder backgroundColor={theme === 'dark' ? '#333' : '#e0e0e0'}>
          {[...Array(5)].map((_, index) => (
            <View key={index} style={styles.skeletonCard}>
              <View style={styles.skeletonNumber} />
              <View style={styles.skeletonText} />
            </View>
          ))}
        </SkeletonPlaceholder>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {filteredData.length === 0 && searchQuery ? (
            <Text style={styles.noResultsText}>No {currentType === 'surah' ? 'Surahs' : 'Juz'} found</Text>
          ) : (
            filteredData.map((item: SurahItem | JuzItem) => (
              <SurahCard
                key={item.number}
                number={item.number.toString().padStart(2, '0')}
                englishName={item.englishName || item.name}
                englishMeaning={
                  'englishNameTranslation' in item
                    ? item.englishNameTranslation || ''
                    : 'meaning' in item
                    ? item.meaning || ''
                    : ''
                }
                arabicName={item.name}
                ayahCount={
                  'numberOfAyahs' in item
                    ? item.numberOfAyahs
                    : 'ayatCount' in item
                    ? item.ayatCount
                    : 0
                }
                type={currentType}
              />
            ))
          )}
        </ScrollView>
      )}

      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
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
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#333' : '#e0e0e0',
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      fontFamily: 'AmiriQuran',
    },
    headerIcons: {
      flexDirection: 'row',
      gap: 16,
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    tab: {
      width: '50%',
      paddingVertical: 12,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: '#4CAF50',
    },
    tabText: {
      fontSize: 18,
      fontWeight: '700',
      fontFamily: 'AmiriQuran',
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 16,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    skeletonCard: {
      flexDirection: 'row',
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0',
    },
    skeletonNumber: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
      backgroundColor: theme === 'dark' ? '#444' : '#ccc',
    },
    skeletonText: {
      flex: 1,
      height: 20,
      borderRadius: 4,
      backgroundColor: theme === 'dark' ? '#444' : '#ccc',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    errorText: {
      color: '#EF4444',
      fontSize: 16,
      textAlign: 'center',
    },
    noResultsText: {
      fontSize: 16,
      color: theme === 'dark' ? '#b0b0b0' : '#666',
      textAlign: 'center',
      marginTop: 24,
    },
  });
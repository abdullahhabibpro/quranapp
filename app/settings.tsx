import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSurah } from '../context/SurahContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { setQari, setTrans, qari, trans } = useSurah();
  const [reciters, setReciters] = useState([]);
  const [fontSize, setFontSize] = useState(18);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('fontSize').then((value) => {
      if (value) setFontSize(parseInt(value));
    });

    setLoading(true);
    fetch('https://api.alquran.cloud/v1/edition?format=audio&type=versebyverse')
      .then((res) => res.json())
      .then((data) => {
        setReciters(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleFontSizeChange = async (size: number) => {
    setFontSize(size);
    await AsyncStorage.setItem('fontSize', size.toString());
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>Dark Mode</Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#ccc', true: '#4CAF50' }}
              thumbColor={theme === 'dark' ? '#fff' : '#f4f4f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Translation</Text>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setTrans('en.sahih')}
          >
            <Text style={[styles.optionText, trans === 'en.sahih' && styles.activeOption]}>
              English (Sahih International)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setTrans('ur.junagarhi')}
          >
            <Text style={[styles.optionText, trans === 'ur.junagarhi' && styles.activeOption]}>
              Urdu (Maulana Junagarhi)
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reciter</Text>
          {loading ? (
            <Text style={styles.optionText}>Loading reciters...</Text>
          ) : (
            reciters.map((reciter: any) => (
              <TouchableOpacity
                key={reciter.identifier}
                style={styles.optionRow}
                onPress={() => setQari(reciter.identifier)}
              >
                <Text style={[styles.optionText, qari === reciter.identifier && styles.activeOption]}>
                  {reciter.englishName}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Font Size</Text>
          <View style={styles.fontSizeContainer}>
            <TouchableOpacity
              style={[styles.fontSizeButton, fontSize === 16 && styles.activeFontSize]}
              onPress={() => handleFontSizeChange(16)}
            >
              <Text style={styles.optionText}>Small</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fontSizeButton, fontSize === 18 && styles.activeFontSize]}
              onPress={() => handleFontSizeChange(18)}
            >
              <Text style={styles.optionText}>Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fontSizeButton, fontSize === 20 && styles.activeFontSize]}
              onPress={() => handleFontSizeChange(20)}
            >
              <Text style={styles.optionText}>Large</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#fff',
      padding: 16,
      paddingTop: 48,
    },
    header: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#000',
      marginBottom: 24,
      textAlign: 'center',
      fontFamily: 'AmiriQuran',
    },
    scrollContent: {
      paddingBottom: 100,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme === 'dark' ? '#fff' : '#000',
      marginBottom: 12,
    },
    optionRow: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
    },
    optionText: {
      fontSize: 16,
      color: theme === 'dark' ? '#b0b0b0' : '#666',
    },
    activeOption: {
      color: '#4CAF50',
      fontWeight: 'bold',
    },
    fontSizeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    fontSizeButton: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: theme === 'dark' ? '#1f2937' : '#f4f4f4',
      flex: 1,
      marginHorizontal: 4,
      alignItems: 'center',
    },
    activeFontSize: {
      backgroundColor: '#4CAF50',
    },
  });
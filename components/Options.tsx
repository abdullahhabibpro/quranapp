import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useSurah } from '../context/SurahContext';
import { useTheme } from '../context/ThemeContext';

const RECITERS_API = 'https://api.alquran.cloud/v1/edition?format=audio&type=versebyverse';

export default function Options() {
  const [showOptions, setShowOptions] = useState(false);
  const [reciters, setReciters] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setQari, setTrans, qari, trans } = useSurah();
  const { theme } = useTheme();

  const styles = createStyles(theme);

  useEffect(() => {
    if (showOptions && reciters.length === 0) {
      setLoading(true);
      fetch(RECITERS_API)
        .then((res) => res.json())
        .then((data) => {
          setReciters(data.data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [showOptions]);

  const handleTranslationChange = (lang: string) => {
    if (lang === 'english') {
      setTrans('en.sahih');
    } else if (lang === 'urdu') {
      setTrans('ur.junagarhi');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleButton} onPress={() => setShowOptions(!showOptions)}>
        <Text style={styles.toggleButtonText}>{showOptions ? 'Hide Options' : 'Show Options'}</Text>
      </TouchableOpacity>
      {showOptions && (
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Translation</Text>
          <TouchableOpacity style={styles.optionRow} onPress={() => handleTranslationChange('english')}>
            <View
              style={[styles.radio, { backgroundColor: trans === 'en.sahih' ? '#4CAF50' : theme === 'dark' ? '#6b7280' : '#d1d5db' }]}
            />
            <Text style={[styles.optionText, { color: theme === 'dark' ? '#fff' : '#000' }]}>English (Sahih International)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow} onPress={() => handleTranslationChange('urdu')}>
            <View
              style={[styles.radio, { backgroundColor: trans === 'ur.junagarhi' ? '#4CAF50' : theme === 'dark' ? '#6b7280' : '#d1d5db' }]}
            />
            <Text style={[styles.optionText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Urdu (Maulana Junagarhi)</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Reciters</Text>
          <ScrollView style={styles.reciterList}>
            {loading && <Text style={[styles.optionText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Loading...</Text>}
            {reciters.map((reciter: any) => (
              <TouchableOpacity
                key={reciter.identifier}
                style={styles.reciterItem}
                onPress={() => setQari(reciter.identifier)}
              >
                <Text
                  style={[styles.optionText, { color: qari === reciter.identifier ? '#4CAF50' : theme === 'dark' ? '#fff' : '#000', fontWeight: qari === reciter.identifier ? 'bold' : 'normal' }]}
                >
                  {reciter.englishName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      padding: 16,
    },
    toggleButton: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: '#4CAF50',
    },
    toggleButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
    },
    optionsContainer: {
      marginTop: 12,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
      backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#000',
      marginBottom: 12,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    radio: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 12,
    },
    optionText: {
      fontSize: 16,
    },
    reciterList: {
      maxHeight: 200,
    },
    reciterItem: {
      paddingVertical: 8,
    },
  });
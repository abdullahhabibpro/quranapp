import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSurah } from '../context/SurahContext';
import { useRouter } from 'expo-router';

export default function SurahCard({
  number,
  englishName,
  englishMeaning,
  arabicName,
  ayahCount,
  type,
}: {
  number: string;
  englishName: string;
  englishMeaning: string;
  arabicName: string;
  ayahCount: number;
  type: 'surah' | 'juz';
}) {
  const { theme } = useTheme();
  const { setSurah, setType } = useSurah();
  const router = useRouter();

  const styles = createStyles(theme);

  const handlePress = () => {
    setSurah(number);
    setType(type);
    router.push(`/${type}/${number}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} accessibilityLabel={`${type} ${englishName}`}>
      <View style={styles.leftContainer}>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{number}</Text>
        </View>
        <View>
          <Text style={[styles.englishName, { color: theme === 'dark' ? '#fff' : '#000' }]}>{englishName}</Text>
          <Text style={[styles.englishMeaning, { color: theme === 'dark' ? '#b0b0b0' : '#666' }]}>{englishMeaning}</Text>
        </View>
      </View>
      <View>
        <Text style={[styles.arabicName, { color: theme === 'dark' ? '#fff' : '#000' }]}>{arabicName}</Text>
        <Text style={[styles.ayahCount, { color: theme === 'dark' ? '#b0b0b0' : '#666' }]}>{ayahCount} Ayat</Text>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 8,
      backgroundColor: theme === 'dark' ? '#1f2937' : '#f4f4f4',
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    numberContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#4CAF50',
      alignItems: 'center',
      justifyContent: 'center',
    },
    numberText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
    },
    englishName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    englishMeaning: {
      fontSize: 14,
    },
    arabicName: {
      fontSize: 20,
      fontWeight: 'bold',
      fontFamily: 'AmiriQuran',
      textAlign: 'right',
    },
    ayahCount: {
      fontSize: 14,
      textAlign: 'right',
    },
  });
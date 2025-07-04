import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  ayahCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
  },
  ayahContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 24,
    fontFamily: 'AmiriQuran_400Regular',
    textAlign: 'right',
    marginBottom: 8,
  },
  ayahNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  ayahNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  translationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  urduText: {
    fontFamily: 'NotoNaskhArabic_400Regular',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  surahCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
  },
  surahContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberBox: {
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  numberText: {
    fontSize: 14,
    fontWeight: 'bold',
    transform: [{ rotate: '-45deg' }],
  },
  surahInfo: {
    marginLeft: 12,
    flex: 1,
  },
  arabicName: {
    fontSize: 18,
    fontFamily: 'AmiriQuran_400Regular',
  },
  englishName: {
    fontSize: 14,
    color: '#666',
  },
  ayatCount: {
    fontSize: 12,
    color: '#666',
  },
  settingsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  darkTheme: {
    card: { backgroundColor: '#333' },
    text: { color: '#fff' },
    textSec: { color: '#B3B3B3' },
    bgSec: { backgroundColor: '#4CAF50' },
  },
  lightTheme: {
    card: { backgroundColor: '#fff' },
    text: { color: '#000' },
    textSec: { color: '#666' },
    bgSec: { backgroundColor: '#E0E0E0' },
  },
});
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../store/themeSlice';
import { setTranslation, setReciter } from '../store/surahSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const currentTranslation = useSelector((state: any) => state.surah.translation);
  const currentReciter = useSelector((state: any) => state.surah.reciter);
  const insets = useSafeAreaInsets();

  const translations = [
    { id: 'en.sahih', name: 'English (Sahih International)' },
    { id: 'ur.junagarhi', name: 'Urdu (Junagarhi)' },
    { id: 'fr.hamidullah', name: 'French (Hamidullah)' },
  ];

  const reciters = [
    { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
    { id: 'ar.abdurrahmanghamdi', name: 'Abdur Rahman Ghamdi' },
    { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
  ];

  const styles = createStyles(theme, insets);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <Animatable.View animation="slideInUp" style={styles.modal}>
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>Theme</Text>
              <TouchableOpacity style={styles.button} onPress={toggleTheme}>
                <Text style={[styles.buttonText, { color: theme === 'dark' ? '#fff' : '#000' }]}>
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>Translation</Text>
              {translations.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.button, currentTranslation === t.id && styles.activeButton]}
                  onPress={() => dispatch(setTranslation(t.id))}
                >
                  <Text style={[styles.buttonText, { color: theme === 'dark' ? '#fff' : '#000' }]}>{t.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>Reciter</Text>
              {reciters.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.button, currentReciter === r.id && styles.activeButton]}
                  onPress={() => dispatch(setReciter(r.id))}
                >
                  <Text style={[styles.buttonText, { color: theme === 'dark' ? '#fff' : '#000' }]}>{r.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animatable.View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: 'light' | 'dark', insets: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modal: {
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingBottom: insets.bottom,
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#333' : '#e0e0e0',
    },
    headerText: {
      fontSize: 20,
      fontWeight: '700',
      fontFamily: 'AmiriQuran',
    },
    content: {
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
    },
    button: {
      padding: 12,
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f0f0f0',
      borderRadius: 8,
      marginBottom: 8,
    },
    activeButton: {
      backgroundColor: '#4CAF50',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '500',
    },
  });
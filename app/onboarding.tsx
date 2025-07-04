import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Quran App',
      description: 'Explore the Quran with a modern, user-friendly interface.',
      image: require('../assets/images/onboarding1.png'),
    },
    {
      title: 'Listen and Reflect',
      description: 'Enjoy high-quality audio recitations with auto-play.',
      image: require('../assets/images/onboarding2.png'),
    },
    {
      title: 'Personalized Experience',
      description: 'Bookmark ayahs, change themes, and access prayer times.',
      image: require('../assets/images/onboarding3.png'),
    },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      router.replace('/index');
    }
  };

  const styles = createStyles(theme, insets);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme === 'dark' ? ['#1e1e1e', '#2a2a2a'] : ['#fff', '#f5f5f5']}
        style={styles.gradient}
      >
        <Animatable.View animation="fadeIn" style={styles.content}>
          <Image source={steps[currentStep].image} style={styles.image} />
          <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#000' }]}>
            {steps[currentStep].title}
          </Text>
          <Text style={[styles.description, { color: theme === 'dark' ? '#b0b0b0' : '#555' }]}>
            {steps[currentStep].description}
          </Text>
          <View style={styles.dots}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, { backgroundColor: index === currentStep ? '#4CAF50' : '#999' }]}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</Text>
          </TouchableOpacity>
        </Animatable.View>
      </LinearGradient>
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
    gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      alignItems: 'center',
      padding: 16,
    },
    image: {
      width: 200,
      height: 200,
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      fontFamily: 'AmiriQuran',
      marginBottom: 16,
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 24,
    },
    dots: {
      flexDirection: 'row',
      marginBottom: 24,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    button: {
      backgroundColor: '#4CAF50',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
  });
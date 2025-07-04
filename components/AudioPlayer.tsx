import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function AudioPlayer() {
  const { theme } = useTheme();
  const { audio, isPlaying, playAudio, stopAudio, playNext, playPrevious, currentAyahIndex, playlist, playbackSpeed, setPlaybackSpeed } = useAudio();
  const insets = useSafeAreaInsets();
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);

  const styles = createStyles(theme, insets);

  if (!audio) return null;

  const handleSpeedChange = async (speed: number) => {
    await setPlaybackSpeed(speed);
    setShowSpeedOptions(false);
  };

  return (
    <Animatable.View animation="slideInUp" style={styles.container}>
      <LinearGradient
        colors={theme === 'dark' ? ['#1e1e1e', '#2a2a2a'] : ['#fff', '#f5f5f5']}
        style={styles.gradient}
      >
        <View style={styles.controls}>
          <TouchableOpacity onPress={playPrevious} disabled={currentAyahIndex === 0}>
            <Icon
              name="skip-previous"
              size={30}
              color={currentAyahIndex === 0 ? '#999' : theme === 'dark' ? '#fff' : '#000'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={isPlaying ? stopAudio : () => playAudio(audio, currentAyahIndex || 0)}>
            <Icon
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={40}
              color={theme === 'dark' ? '#fff' : '#000'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={playNext} disabled={currentAyahIndex === playlist.length - 1}>
            <Icon
              name="skip-next"
              size={30}
              color={currentAyahIndex === playlist.length - 1 ? '#999' : theme === 'dark' ? '#fff' : '#000'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSpeedOptions(!showSpeedOptions)}>
            <Text style={[styles.speedText, { color: theme === 'dark' ? '#fff' : '#000' }]}>{playbackSpeed}x</Text>
          </TouchableOpacity>
        </View>
        {showSpeedOptions && (
          <Animatable.View animation="fadeIn" style={styles.speedOptions}>
            {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
              <TouchableOpacity key={speed} onPress={() => handleSpeedChange(speed)} style={styles.speedButton}>
                <Text style={[styles.speedButtonText, { color: theme === 'dark' ? '#fff' : '#000' }]}>{speed}x</Text>
              </TouchableOpacity>
            ))}
          </Animatable.View>
        )}
      </LinearGradient>
    </Animatable.View>
  );
}

const createStyles = (theme: 'light' | 'dark', insets: any) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: insets.bottom,
      left: 0,
      right: 0,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },
    gradient: {
      padding: 16,
      flexDirection: 'column',
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    speedText: {
      fontSize: 16,
      fontWeight: '600',
    },
    speedOptions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 8,
    },
    speedButton: {
      padding: 8,
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f0f0f0',
      borderRadius: 8,
    },
    speedButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
  });
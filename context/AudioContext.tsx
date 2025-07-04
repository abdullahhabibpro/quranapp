import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useSurah } from './SurahContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

interface AudioContextType {
  audio: string;
  isPlaying: boolean;
  currentAyahIndex: number | null;
  playAudio: (url: string, index: number) => void;
  stopAudio: () => void;
  playNext: () => void;
  playPrevious: () => void;
  playlist: string[];
  setPlaylist: (urls: string[]) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [audio, setAudio] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number | null>(null);
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const { surah, type } = useSurah();

  const playAudio = async (audioUrl: string, index: number) => {
    if (audio === audioUrl && isPlaying && currentAyahIndex === index) {
      await stopAudio();
      return;
    }

    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: true, progressUpdateIntervalMillis: 100, rate: playbackSpeed, shouldCorrectPitch: true }
    );
    soundRef.current = sound;
    setAudio(audioUrl);
    setIsPlaying(true);
    setCurrentAyahIndex(index);

    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        await playNext();
      }
    });

    await sound.playAsync();
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setIsPlaying(false);
    setAudio('');
    setCurrentAyahIndex(null);
  };

  const playNext = async () => {
    const nextIndex = (currentAyahIndex || 0) + 1;
    if (nextIndex < playlist.length) {
      await playAudio(playlist[nextIndex], nextIndex);
    } else {
      await stopAudio();
    }
  };

  const playPrevious = async () => {
    const prevIndex = (currentAyahIndex || 0) - 1;
    if (prevIndex >= 0) {
      await playAudio(playlist[prevIndex], prevIndex);
    }
  };

  const handleSetPlaybackSpeed = async (speed: number) => {
    setPlaybackSpeed(speed);
    if (soundRef.current && isPlaying) {
      await soundRef.current.setRateAsync(speed, true);
    }
  };

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    stopAudio();
  }, [surah, type]);

  return (
    <AudioContext.Provider
      value={{
        audio,
        isPlaying,
        currentAyahIndex,
        playAudio,
        stopAudio,
        playNext,
        playPrevious,
        playlist,
        setPlaylist,
        playbackSpeed,
        setPlaybackSpeed: handleSetPlaybackSpeed,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
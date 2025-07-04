import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { LinearGradient } from 'expo-linear-gradient';

export default function QiblaScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let subscription: any;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location permission not granted');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const lat = loc.coords.latitude;
      const lon = loc.coords.longitude;
      const qibla = calculateQiblaDirection(lat, lon);
      setQiblaDirection(qibla);

      subscription = Magnetometer.addListener(data => {
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        setHeading(angle);
      });

      Magnetometer.setUpdateInterval(500);
    })();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  const calculateQiblaDirection = (lat: number, lon: number) => {
    const meccaLat = 21.4225;
    const meccaLon = 39.8262;
    const phiK = (meccaLat * Math.PI) / 180;
    const lambdaK = (meccaLon * Math.PI) / 180;
    const phi = (lat * Math.PI) / 180;
    const lambda = (lon * Math.PI) / 180;
    const deltaLambda = lambdaK - lambda;
    const numerator = Math.sin(deltaLambda);
    const denominator = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(deltaLambda);
    let qibla = (Math.atan2(numerator, denominator) * 180) / Math.PI;
    return qibla < 0 ? qibla + 360 : qibla;
  };

  const styles = createStyles(theme, insets);
  const rotateDeg = heading - qiblaDirection;

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <Text style={[styles.headerText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Qibla Direction</Text>
      </Animatable.View>

      <LinearGradient
        colors={theme === 'dark' ? ['#1a1a1a', '#333'] : ['#fff', '#f0f0f0']}
        style={styles.compassContainer}
      >
        {errorMsg ? (
          <Text style={{ color: 'red', textAlign: 'center' }}>{errorMsg}</Text>
        ) : (
          <>
            <Image
              source={require('../assets/images/compass.png')}
              style={[
                styles.compass,
                {
                  transform: [{ rotate: `${rotateDeg}deg` }],
                },
              ]}
            />
            <Text style={[styles.directionText, { color: theme === 'dark' ? '#fff' : '#000' }]}>
              Qibla: {Math.round(qiblaDirection)}°
            </Text>
          </>
        )}
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
    header: {
      padding: 16,
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#333' : '#e0e0e0',
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: 'AmiriQuran',
      textAlign: 'center',
    },
    compassContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
      margin: 20,
      padding: 20,
      elevation: 4,
    },
    compass: {
      width: 240,
      height: 240,
    },
    directionText: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 20,
    },
  });

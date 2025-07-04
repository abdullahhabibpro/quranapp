import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TranslationsScreen() {
  return (
    <View style={styles.container}>
      <Text>Translations Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
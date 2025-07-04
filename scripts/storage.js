import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save ${key}:`, err);
  }
};

export const getData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`Failed to get ${key}:`, err);
    return null;
  }
};

export const clearData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.error(`Failed to clear ${key}:`, err);
  }
};
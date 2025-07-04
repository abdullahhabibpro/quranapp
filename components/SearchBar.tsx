import { View, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  onSearch?: (query: string) => void;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  recentSearches,
  onSearch,
}: SearchBarProps) {
  const { theme } = useTheme();
  const [input, setInput] = useState(searchQuery);
  const debouncedSearch = useDebounce((value: string) => {
    setSearchQuery(value);
    if (onSearch) onSearch(value);
  }, 500);

  const styles = createStyles(theme);

  const handleChange = (text: string) => {
    setInput(text);
    debouncedSearch(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Surahs or Juz"
        placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#6b7280'}
        value={input}
        onChangeText={handleChange}
        accessibilityLabel="Search input"
      />
      {recentSearches.length > 0 && (
        <FlatList
          data={recentSearches}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recentSearch}
              onPress={() => handleChange(item)}
            >
              <Text style={styles.recentSearchText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.recentSearchesContainer}
        />
      )}
    </View>
  );
}

const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      width: '100%',
      maxWidth: 448,
      marginBottom: 16,
    },
    input: {
      width: '100%',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
      borderRadius: 999,
      backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 16,
    },
    recentSearchesContainer: {
      marginTop: 8,
    },
    recentSearch: {
      padding: 8,
      marginRight: 8,
      borderRadius: 16,
      backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0',
    },
    recentSearchText: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 14,
    },
  });
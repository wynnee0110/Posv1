// ─── SearchBar Component ──────────────────────────────────────────────────────

import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Pressable, TextInput, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar = memo(({ value, onChangeText, placeholder = 'Search food...' }: SearchBarProps) => {
  return (
    <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-sm"
      style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 }}>
      <Ionicons name="search-outline" size={20} color="#9CA3AF" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        className="flex-1 ml-3 text-gray-800 text-base"
        style={{ fontFamily: 'System' }}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <Ionicons name="close-circle" size={20} color="#9CA3AF" />
        </Pressable>
      )}
    </View>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
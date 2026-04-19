import SearchBar from '@/components/searchbar';
import { View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white">
      <SearchBar />
    </View>
  );
}
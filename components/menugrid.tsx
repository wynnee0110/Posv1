import { FlatList, Text, View, Image, TouchableOpacity, SafeAreaView } from "react-native";

const DATA = [
  { id: "1", name: "Lechon", image: require("../assets/images/Lechon.png") },
  { id: "2", name: "Lechon Belly", image: require("../assets/images/Lechon-belly.png") },
  { id: "3", name: "Fries", image: "https://via.placeholder.com/100" },
  { id: "4", name: "Chicken", image: "https://via.placeholder.com/100" },
  { id: "5", name: "Pasta", image: "https://via.placeholder.com/100" },
  { id: "6", name: "Salad", image: "https://via.placeholder.com/100" },
  { id: "7", name: "Steak", image: "https://via.placeholder.com/100" },
  { id: "8", name: "Sushi", image: "https://via.placeholder.com/100" },
];

export default function MenuGrid() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={DATA}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 8 }}
        renderItem={({ item }) => (
          <View className="flex-1 p-2">
            <View className="rounded-2xl p-4 items-center bg-gray-100 shadow-sm">
              
              {/* FIXED IMAGE LOGIC */}
              <Image
                source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                className="w-32 h-32 rounded-lg mb-3"
                resizeMode="contain"
              />

              <View className="w-full flex-row justify-between items-center px-1">
                <View className="flex-1 mr-2">
                  <Text className="font-bold text-gray-800 text-base" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-orange-600 font-semibold">$10.00</Text>
                </View>

                {/* PLUS BUTTON */}
                <TouchableOpacity 
                  activeOpacity={0.7}
                  className="bg-orange-500 w-10 h-10 rounded-full items-center justify-center shadow-sm"
                  onPress={() => console.log(`${item.name} added`)}
                >
                  <Text className="text-white text-2xl font-bold mt-[-2px]">+</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
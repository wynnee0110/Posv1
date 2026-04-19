import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 50,
  },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
  },
});
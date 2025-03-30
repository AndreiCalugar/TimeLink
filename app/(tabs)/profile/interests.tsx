import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Appbar } from "react-native-paper";
import { useRouter } from "expo-router";

export default function InterestsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Manage Interests" />
      </Appbar.Header>
      <View style={styles.content}>
        <Text>Interests management screen</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

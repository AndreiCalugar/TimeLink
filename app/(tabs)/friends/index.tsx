import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Button, Surface, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "../../../context/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../components/ui/AppHeader";

export default function FriendsFeedScreen() {
  const { user } = useUser();
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["right", "left"]}
    >
      <AppHeader title="Friends Feed" rightActionIcon="magnify" />

      <Surface style={styles.contentContainer} elevation={0}>
        <View style={styles.comingSoonContainer}>
          <MaterialCommunityIcons
            name="account-group"
            size={80}
            color={theme.colors.primary}
            style={styles.icon}
          />
          <Text variant="headlineMedium" style={styles.title}>
            Coming Soon
          </Text>
          <Text style={styles.description}>
            The friends feed will allow you to see events and updates from your
            connections. Stay tuned for this exciting feature!
          </Text>
          <Button
            mode="contained"
            onPress={() => {}}
            style={styles.button}
            icon="account-plus"
          >
            Add Friends
          </Button>
        </View>
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    paddingHorizontal: 16,
  },
});

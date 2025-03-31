import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ErrorScreenProps {
  message?: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export default function ErrorScreen({
  message = "Something went wrong. Please try again.",
  buttonText = "Try Again",
  onButtonPress,
}: ErrorScreenProps) {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={80}
        color={theme.colors.error}
      />
      <Text style={[styles.message, { color: theme.colors.onBackground }]}>
        {message}
      </Text>
      {onButtonPress && (
        <Button
          mode="contained"
          onPress={onButtonPress}
          style={styles.button}
          buttonColor={theme.colors.error}
        >
          {buttonText}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 16,
  },
});

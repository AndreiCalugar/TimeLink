import React from "react";
import { Text as RNText, TextProps, StyleSheet } from "react-native";

// This component is a replacement for react-native-paper Text that avoids variant issues
export default function AppText({
  style,
  children,
  variant, // We'll accept variant but ignore it to maintain API compatibility
  ...props
}: TextProps & { variant?: string }) {
  // Choose default styling based on the variant name, but using our own implementation
  let variantStyle = {};
  if (variant === "headlineMedium") {
    variantStyle = styles.headline;
  } else if (variant === "bodyMedium") {
    variantStyle = styles.body;
  } else if (variant === "labelLarge") {
    variantStyle = styles.label;
  } else if (variant === "titleMedium") {
    variantStyle = styles.title;
  }

  return (
    <RNText style={[variantStyle, style]} {...props}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  headline: {
    fontSize: 24,
    fontWeight: "bold",
  },
  body: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

import React from "react";
import { Appbar, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightActionIcon?: string;
  onRightActionPress?: () => void;
  secondaryRightActionIcon?: string;
  onSecondaryRightActionPress?: () => void;
  elevated?: boolean;
  backDestination?: any;
  onBackPress?: () => void;
}

export default function AppHeader({
  title,
  showBackButton = false,
  rightActionIcon,
  onRightActionPress,
  secondaryRightActionIcon,
  onSecondaryRightActionPress,
  elevated = true,
  backDestination,
  onBackPress,
}: AppHeaderProps) {
  const router = useRouter();
  const theme = useTheme();

  const handleBackPress = () => {
    if (onBackPress) {
      // Use custom back handler if provided
      onBackPress();
    } else if (backDestination) {
      // Navigate to specific destination if provided
      router.push(backDestination);
    } else {
      // Default behavior: go back to previous screen
      router.back();
    }
  };

  return (
    <Appbar.Header
      elevated={elevated}
      style={[styles.header, { backgroundColor: theme.colors.surface }]}
    >
      {showBackButton && <Appbar.BackAction onPress={handleBackPress} />}
      <Appbar.Content title={title} titleStyle={styles.title} />

      {secondaryRightActionIcon && (
        <Appbar.Action
          icon={secondaryRightActionIcon}
          onPress={onSecondaryRightActionPress || (() => {})}
          color={theme.colors.primary}
        />
      )}

      {rightActionIcon && (
        <Appbar.Action
          icon={rightActionIcon}
          onPress={onRightActionPress || (() => {})}
          color={theme.colors.primary}
        />
      )}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    elevation: 4,
  },
  title: {
    fontWeight: "500",
  },
});

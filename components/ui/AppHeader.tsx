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
}

export default function AppHeader({
  title,
  showBackButton = false,
  rightActionIcon,
  onRightActionPress,
  secondaryRightActionIcon,
  onSecondaryRightActionPress,
  elevated = true,
}: AppHeaderProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Appbar.Header
      elevated={elevated}
      style={[styles.header, { backgroundColor: theme.colors.surface }]}
    >
      {showBackButton && <Appbar.BackAction onPress={() => router.back()} />}
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

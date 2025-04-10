import React, { createContext, useContext, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Text, Surface, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type ToastType = "success" | "error" | "info" | "warning";

// Define icon type as keyof typeof MaterialCommunityIcons.glyphMap
type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  icon?: IconName;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("info");
  const [icon, setIcon] = useState<IconName>("information-outline");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getIconForType = (type: ToastType): IconName => {
    switch (type) {
      case "success":
        return "check-circle-outline";
      case "error":
        return "alert-circle-outline";
      case "warning":
        return "alert-outline";
      case "info":
      default:
        return "information-outline";
    }
  };

  const getColorForType = (type: ToastType): string => {
    switch (type) {
      case "success":
        return theme.colors.primary;
      case "error":
        return theme.colors.error;
      case "warning":
        return "#FF9800";
      case "info":
      default:
        return theme.colors.primary;
    }
  };

  const showToast = ({
    message,
    type = "info",
    duration = 3000,
    icon: customIcon,
  }: ToastOptions) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Update toast content
    setMessage(message);
    setToastType(type);
    setIcon(customIcon || getIconForType(type));
    setVisible(true);

    // Animate in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Set timeout to hide toast
    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  };

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.container,
            { opacity: fadeAnim },
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Surface style={styles.toast} elevation={4}>
            <MaterialCommunityIcons
              name={icon}
              size={24}
              color={getColorForType(toastType)}
              style={styles.icon}
            />
            <Text style={styles.message}>{message}</Text>
          </Surface>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    maxWidth: "90%",
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
  },
});

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastProvider;

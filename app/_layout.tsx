import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { ProfileProvider } from "../context/ProfileContext";
import { CalendarProvider } from "../context/CalendarContext";
import { UserProvider } from "../context/UserContext";
import { DiscoveryProvider } from "../context/DiscoveryContext";
import { FriendsProvider } from "../context/FriendsContext";
import { ToastProvider } from "../context/ToastContext";
import {
  Provider as PaperProvider,
  MD3LightTheme,
  configureFonts,
} from "react-native-paper";
import { useColorScheme } from "@/hooks/useColorScheme";
import StatusBarManager from "../components/ui/StatusBarManager";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Define a more complete theme with custom colors
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#2196F3", // Blue
    primaryContainer: "#E3F2FD",
    secondary: "#4CAF50", // Green
    secondaryContainer: "#E8F5E9",
    tertiary: "#FF9800", // Orange
    tertiaryContainer: "#FFF3E0",
    error: "#F44336",
    errorContainer: "#FFEBEE",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceVariant: "#F5F5F5",
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    onTertiary: "#FFFFFF",
    onError: "#FFFFFF",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <UserProvider>
          <ProfileProvider>
            <CalendarProvider>
              <FriendsProvider>
                <DiscoveryProvider>
                  <ToastProvider>
                    <ThemeProvider
                      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                    >
                      <Stack>
                        <Stack.Screen
                          name="(tabs)"
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="profile"
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen name="+not-found" />
                      </Stack>
                      <StatusBarManager />
                    </ThemeProvider>
                  </ToastProvider>
                </DiscoveryProvider>
              </FriendsProvider>
            </CalendarProvider>
          </ProfileProvider>
        </UserProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

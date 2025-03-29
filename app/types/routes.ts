export type AppRoutes = {
  "/(tabs)": undefined;
  "/(tabs)/profile/edit": undefined;
  "/(tabs)/profile/events": undefined;
  "/(tabs)/profile/events/[id]": { id: string };
  "/(tabs)/profile/photos": undefined;
  "/(tabs)/profile/photos/[id]": { id: string };
  "/(tabs)/profile/photos/upload": undefined;
  "/(tabs)/profile/friends": undefined;
  "/(tabs)/profile/friends/[id]": { id: string };
  "/(tabs)/profile/interests": undefined;
  "/(tabs)/profile/interests/[id]": { id: string };
};

// Add default export to satisfy Expo Router requirements
export default AppRoutes;

import { Redirect } from "expo-router";

export default function ProfileRedirect() {
  // Redirect to the tabbed profile page
  return <Redirect href="/(tabs)/profile" />;
}

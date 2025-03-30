import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";
import { useUserContext } from "@/context/UserContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import AppText from "@/components/ui/AppText";

// Temporary implementation to diagnose the Text variant issue
export default function ProfileScreen() {
  const { userProfile } = useUserContext();
  const router = useRouter();

  if (!userProfile) {
    return <AppText>Loading profile...</AppText>;
  }

  return (
    <ScrollView style={styles.container}>
      <ProfileHeader
        name={userProfile.name}
        bio={userProfile.bio}
        profilePicture={userProfile.avatar}
        onEdit={() => router.push("/(tabs)/profile/edit")}
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText style={styles.sectionTitle}>Profile Screen</AppText>
        </View>
        <AppText>
          Welcome to your profile. This is a simplified version for debugging.
        </AppText>
        <Button
          mode="outlined"
          onPress={() => router.push("/(tabs)/profile/edit")}
          style={styles.button}
        >
          Edit Profile
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    marginTop: 12,
  },
});

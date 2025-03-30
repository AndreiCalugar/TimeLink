import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Button } from "react-native-paper";
import AppText from "@/components/ui/AppText"; // Import our custom Text component

interface ProfileHeaderProps {
  name: string;
  bio?: string;
  profilePicture?: string;
  onEdit: () => void;
}

// Simplifying the ProfileHeader component to diagnose the issue
export default function ProfileHeader({
  name,
  bio,
  profilePicture,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      {profilePicture ? (
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
      ) : (
        <View style={[styles.profilePicture, { backgroundColor: "#e1e1e1" }]}>
          <AppText style={{ fontSize: 36, textAlign: "center" }}>
            {name.substring(0, 2).toUpperCase()}
          </AppText>
        </View>
      )}
      <AppText style={[styles.name, { fontSize: 24, fontWeight: "bold" }]}>
        {name}
      </AppText>
      {bio && <AppText style={styles.bio}>{bio}</AppText>}
      <Button
        mode="outlined"
        onPress={onEdit}
        style={styles.editButton}
        labelStyle={{ textTransform: "none" }}
      >
        Edit Profile
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    justifyContent: "center",
  },
  name: {
    marginBottom: 4,
    textAlign: "center",
  },
  bio: {
    textAlign: "center",
    color: "#666",
    marginBottom: 16,
  },
  editButton: {
    marginTop: 8,
  },
});

import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Button, Avatar } from "react-native-paper";

interface ProfileHeaderProps {
  name: string;
  bio?: string;
  profilePicture?: string;
  onEdit: () => void;
}

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
        <Avatar.Text
          size={100}
          label={name.substring(0, 2).toUpperCase()}
          style={styles.profilePicture}
        />
      )}
      <Text variant="headlineMedium" style={styles.name}>
        {name}
      </Text>
      {bio && <Text style={styles.bio}>{bio}</Text>}
      <Button mode="outlined" onPress={onEdit} style={styles.editButton}>
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

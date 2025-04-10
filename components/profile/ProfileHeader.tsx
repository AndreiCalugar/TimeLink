import React from "react";
import { StyleSheet, View, Image, ImageBackground } from "react-native";
import { Text, Button, Avatar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ProfileHeaderProps {
  name: string;
  bio?: string;
  profilePicture?: string;
  coverPhoto?: string;
  location?: string;
  joinDate?: string;
  onEdit?: () => void;
}

export default function ProfileHeader({
  name,
  bio,
  profilePicture,
  coverPhoto,
  location,
  joinDate,
  onEdit,
}: ProfileHeaderProps) {
  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <View style={styles.container}>
      {/* Cover Photo */}
      {coverPhoto ? (
        <ImageBackground
          source={{ uri: coverPhoto }}
          style={styles.coverPhoto}
          resizeMode="cover"
        >
          <View style={styles.coverOverlay} />
        </ImageBackground>
      ) : (
        <View style={styles.coverPhotoPlaceholder} />
      )}

      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        {profilePicture ? (
          <Avatar.Image
            size={100}
            source={{ uri: profilePicture }}
            style={styles.profilePicture}
          />
        ) : (
          <Avatar.Text
            size={100}
            label={getInitials(name)}
            style={styles.profilePicture}
          />
        )}
      </View>

      {/* Profile Information */}
      <View style={styles.infoContainer}>
        <Text variant="headlineMedium" style={styles.name}>
          {name}
        </Text>

        {bio && (
          <Text variant="bodyMedium" style={styles.bio}>
            {bio}
          </Text>
        )}

        <View style={styles.detailsContainer}>
          {location && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color="#666"
              />
              <Text variant="bodySmall" style={styles.detailText}>
                {location}
              </Text>
            </View>
          )}

          {joinDate && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="calendar" size={16} color="#666" />
              <Text variant="bodySmall" style={styles.detailText}>
                Joined {joinDate}
              </Text>
            </View>
          )}
        </View>

        {onEdit && (
          <Button
            mode="outlined"
            onPress={onEdit}
            icon="account-edit"
            style={styles.editButton}
          >
            Edit Profile
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  coverPhoto: {
    height: 150,
    width: "100%",
  },
  coverPhotoPlaceholder: {
    height: 150,
    width: "100%",
    backgroundColor: "#e0e0e0",
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  profilePictureContainer: {
    alignItems: "center",
    marginTop: -50,
  },
  profilePicture: {
    borderWidth: 4,
    borderColor: "#fff",
  },
  infoContainer: {
    alignItems: "center",
    padding: 16,
  },
  name: {
    fontWeight: "bold",
    marginTop: 8,
  },
  bio: {
    textAlign: "center",
    marginVertical: 8,
    paddingHorizontal: 16,
    color: "#666",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
    flexWrap: "wrap",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 4,
  },
  detailText: {
    marginLeft: 4,
    color: "#666",
  },
  editButton: {
    marginTop: 8,
  },
});

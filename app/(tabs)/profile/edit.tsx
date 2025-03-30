import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Button,
  TextInput,
  Text,
  Appbar,
  Avatar,
  SegmentedButtons,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "../../../context/UserContext";
import { useProfile } from "../../../context/ProfileContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Define privacy setting type for clarity
type PrivacyLevel = "public" | "friends" | "private";

export default function EditProfileScreen() {
  const { user, updateUser } = useUser();
  const { profile, updateProfile } = useProfile();
  const router = useRouter();

  const [name, setName] = useState(profile?.name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [profileVisibility, setProfileVisibility] = useState<PrivacyLevel>(
    profile?.privacySettings?.profileVisibility || "public"
  );
  const [photoVisibility, setPhotoVisibility] = useState<PrivacyLevel>(
    profile?.privacySettings?.photoVisibility || "public"
  );
  const [locationVisibility, setLocationVisibility] = useState<PrivacyLevel>(
    profile?.privacySettings?.locationVisibility || "public"
  );
  const [friendsVisibility, setFriendsVisibility] = useState<PrivacyLevel>(
    profile?.privacySettings?.friendsVisibility || "public"
  );
  const [profilePicture, setProfilePicture] = useState(
    profile?.profilePicture || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Update user info
      if (user) {
        await updateUser({
          name,
          bio,
          location,
        });
      }

      // Update profile with all privacy settings
      updateProfile({
        name,
        bio,
        location,
        profilePicture,
        privacySettings: {
          profileVisibility,
          photoVisibility,
          locationVisibility,
          friendsVisibility,
        },
      });

      // Navigate back
      router.back();
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Show error message
    } finally {
      setIsLoading(false);
    }
  };

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Custom handler for SegmentedButtons to address type issues
  const handlePrivacyChange =
    (setter: React.Dispatch<React.SetStateAction<PrivacyLevel>>) =>
    (value: string) =>
      setter(value as PrivacyLevel);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Edit Profile" />
        <Appbar.Action icon="check" onPress={handleSave} />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.avatarContainer}>
            {profilePicture ? (
              <Avatar.Image size={100} source={{ uri: profilePicture }} />
            ) : (
              <Avatar.Text size={100} label={getInitials(name)} />
            )}
            <Button
              mode="contained-tonal"
              style={styles.changePhotoButton}
              icon="camera"
              onPress={pickImage}
            >
              Change Photo
            </Button>
          </View>

          <View style={styles.formSection}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Basic Information
            </Text>
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Bio"
              value={bio}
              onChangeText={setBio}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={4}
            />
            <TextInput
              label="Location"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
              mode="outlined"
              right={<TextInput.Icon icon="map-marker" />}
            />
          </View>

          <View style={styles.formSection}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Privacy Settings
            </Text>

            <Text variant="bodyMedium" style={styles.optionTitle}>
              Profile Visibility
            </Text>
            <SegmentedButtons
              value={profileVisibility}
              onValueChange={handlePrivacyChange(setProfileVisibility)}
              buttons={[
                {
                  value: "public",
                  label: "Public",
                  icon: "earth",
                },
                {
                  value: "friends",
                  label: "Friends",
                  icon: "account-group",
                },
                {
                  value: "private",
                  label: "Private",
                  icon: "lock",
                },
              ]}
              style={styles.segmentedButtons}
            />

            <Text variant="bodyMedium" style={styles.optionTitle}>
              Photo Visibility
            </Text>
            <SegmentedButtons
              value={photoVisibility}
              onValueChange={handlePrivacyChange(setPhotoVisibility)}
              buttons={[
                {
                  value: "public",
                  label: "Public",
                  icon: "earth",
                },
                {
                  value: "friends",
                  label: "Friends",
                  icon: "account-group",
                },
                {
                  value: "private",
                  label: "Private",
                  icon: "lock",
                },
              ]}
              style={styles.segmentedButtons}
            />

            <Text variant="bodyMedium" style={styles.optionTitle}>
              Location Visibility
            </Text>
            <SegmentedButtons
              value={locationVisibility}
              onValueChange={handlePrivacyChange(setLocationVisibility)}
              buttons={[
                {
                  value: "public",
                  label: "Public",
                  icon: "earth",
                },
                {
                  value: "friends",
                  label: "Friends",
                  icon: "account-group",
                },
                {
                  value: "private",
                  label: "Private",
                  icon: "lock",
                },
              ]}
              style={styles.segmentedButtons}
            />

            <Text variant="bodyMedium" style={styles.optionTitle}>
              Friends List Visibility
            </Text>
            <SegmentedButtons
              value={friendsVisibility}
              onValueChange={handlePrivacyChange(setFriendsVisibility)}
              buttons={[
                {
                  value: "public",
                  label: "Public",
                  icon: "earth",
                },
                {
                  value: "friends",
                  label: "Friends",
                  icon: "account-group",
                },
                {
                  value: "private",
                  label: "Private",
                  icon: "lock",
                },
              ]}
              style={styles.segmentedButtons}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            icon="content-save"
            loading={isLoading}
            disabled={isLoading}
          >
            Save Changes
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  changePhotoButton: {
    marginTop: 12,
  },
  formSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
  },
  optionTitle: {
    marginVertical: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  saveButton: {
    marginVertical: 24,
  },
});

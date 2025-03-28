import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Button, TextInput, Text } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useProfileContext } from "../../../context/ProfileContext";

export default function EditProfileScreen() {
  const { profile, updateProfile } = useProfileContext();
  const router = useRouter();

  const [name, setName] = useState(profile?.name || "");
  const [bio, setBio] = useState(profile?.bio || "");
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
      await updateProfile({
        name,
        bio,
        profilePicture,
      });
      router.back();
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Show error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, styles.placeholderImage]} />
        )}
        <TouchableOpacity onPress={pickImage} style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          label="Bio"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isLoading}
            disabled={isLoading}
            style={styles.saveButton}
          >
            Save Changes
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    backgroundColor: "#e1e1e1",
  },
  changePhotoButton: {
    marginTop: 12,
  },
  changePhotoText: {
    color: "#2196F3",
    fontSize: 16,
  },
  formContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
  saveButton: {
    marginBottom: 12,
  },
});

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, ScrollView, Platform } from "react-native";
import {
  Text,
  Appbar,
  Button,
  TextInput,
  SegmentedButtons,
} from "react-native-paper";
import { useProfile } from "../../../context/ProfileContext";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Photo } from "../../../types/profile";

export default function UploadPhotoScreen() {
  const { uploadPhoto } = useProfile();
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState<
    "public" | "friends" | "private"
  >("friends");

  useEffect(() => {
    // Request permission to access the camera roll
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = () => {
    if (!image) {
      alert("Please select an image to upload");
      return;
    }

    const newPhoto: Omit<Photo, "id"> = {
      uri: image,
      caption,
      location: location || undefined,
      date: new Date().toISOString().split("T")[0],
      visibility,
      likes: 0,
    };

    uploadPhoto(newPhoto);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Upload Photo" />
        <Appbar.Action icon="check" onPress={handleUpload} disabled={!image} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No image selected</Text>
              <Button
                mode="contained"
                onPress={pickImage}
                style={styles.selectButton}
              >
                Select Image
              </Button>
            </View>
          )}
          {image && (
            <Button
              mode="outlined"
              onPress={pickImage}
              style={styles.changeButton}
              icon="image-edit"
            >
              Change Image
            </Button>
          )}
        </View>

        <View style={styles.formSection}>
          <TextInput
            label="Caption"
            value={caption}
            onChangeText={setCaption}
            style={styles.input}
            mode="outlined"
            multiline
          />
          <TextInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            mode="outlined"
            right={<TextInput.Icon icon="map-marker" />}
          />

          <Text style={styles.visibilityLabel}>Who can see this photo?</Text>
          <SegmentedButtons
            value={visibility}
            onValueChange={(value) =>
              setVisibility(value as "public" | "friends" | "private")
            }
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
          onPress={handleUpload}
          style={styles.uploadButton}
          icon="cloud-upload"
          disabled={!image}
        >
          Upload Photo
        </Button>
      </ScrollView>
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
  imageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginBottom: 16,
    color: "#757575",
  },
  selectButton: {
    marginTop: 8,
  },
  changeButton: {
    marginTop: 12,
  },
  formSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  visibilityLabel: {
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  uploadButton: {
    marginVertical: 24,
  },
});

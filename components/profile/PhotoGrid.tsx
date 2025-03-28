import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

interface Photo {
  id: string;
  uri: string;
}

interface PhotoGridProps {
  photos: Photo[];
  onPhotoPress: (photo: Photo) => void;
}

export default function PhotoGrid({ photos, onPhotoPress }: PhotoGridProps) {
  return (
    <View style={styles.grid}>
      {photos.map((photo) => (
        <TouchableOpacity
          key={photo.id}
          onPress={() => onPhotoPress(photo)}
          style={styles.photoContainer}
        >
          <Image source={{ uri: photo.uri }} style={styles.photo} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  photoContainer: {
    width: "33.33%",
    padding: 4,
  },
  photo: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 4,
  },
});

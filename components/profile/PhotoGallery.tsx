import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import { Text, Card, Button, IconButton, Chip } from "react-native-paper";
import { Photo } from "../../types/profile";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface PhotoGalleryProps {
  photos: Photo[];
  onAddPhoto: () => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onAddPhoto }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const { width } = Dimensions.get("window");
  const photoSize = (width - 48) / 3; // 3 photos per row with 8px spacing

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "earth";
      case "friends":
        return "account-group";
      case "private":
        return "lock";
      default:
        return "earth";
    }
  };

  const renderPhotoItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={[styles.photoContainer, { width: photoSize, height: photoSize }]}
      onPress={() => setSelectedPhoto(item)}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.photo}
        resizeMode="cover"
      />
      <View style={styles.photoOverlay}>
        <MaterialCommunityIcons
          name={getVisibilityIcon(item.visibility)}
          size={16}
          color="#fff"
          style={styles.visibilityIcon}
        />
        {item.likes && item.likes > 0 && (
          <View style={styles.likesContainer}>
            <MaterialCommunityIcons name="heart" size={12} color="#fff" />
            <Text style={styles.likesText}>{item.likes}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const PhotoModal = () => {
    if (!selectedPhoto) return null;

    return (
      <Modal
        visible={!!selectedPhoto}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <IconButton
              icon="close"
              size={24}
              iconColor="#fff"
              style={styles.closeButton}
              onPress={() => setSelectedPhoto(null)}
            />

            <Image
              source={{ uri: selectedPhoto.uri }}
              style={styles.modalImage}
              resizeMode="contain"
            />

            <View style={styles.modalInfo}>
              {selectedPhoto.caption && (
                <Text variant="bodyLarge" style={styles.caption}>
                  {selectedPhoto.caption}
                </Text>
              )}

              <View style={styles.modalDetails}>
                <View style={styles.modalDetailRow}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={18}
                    color="#666"
                  />
                  <Text variant="bodyMedium" style={styles.detailText}>
                    {selectedPhoto.date || "No date"}
                  </Text>
                </View>

                {selectedPhoto.location && (
                  <View style={styles.modalDetailRow}>
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={18}
                      color="#666"
                    />
                    <Text variant="bodyMedium" style={styles.detailText}>
                      {selectedPhoto.location}
                    </Text>
                  </View>
                )}

                <View style={styles.modalDetailRow}>
                  <MaterialCommunityIcons
                    name={getVisibilityIcon(selectedPhoto.visibility)}
                    size={18}
                    color="#666"
                  />
                  <Text variant="bodyMedium" style={styles.detailText}>
                    {selectedPhoto.visibility.charAt(0).toUpperCase() +
                      selectedPhoto.visibility.slice(1)}
                  </Text>
                </View>

                {selectedPhoto.likes && selectedPhoto.likes > 0 && (
                  <View style={styles.modalDetailRow}>
                    <MaterialCommunityIcons
                      name="heart"
                      size={18}
                      color="#666"
                    />
                    <Text variant="bodyMedium" style={styles.detailText}>
                      {selectedPhoto.likes} likes
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="Photos"
          right={(props) => (
            <Button
              mode="contained"
              onPress={onAddPhoto}
              icon="camera-plus"
              compact
            >
              Add Photo
            </Button>
          )}
        />
        <Card.Content>
          {photos.length > 0 ? (
            <FlatList
              data={photos}
              renderItem={renderPhotoItem}
              keyExtractor={(item) => item.id}
              numColumns={3}
              columnWrapperStyle={styles.photoGrid}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="image-off" size={48} color="#ccc" />
              <Text variant="bodyLarge" style={styles.emptyText}>
                No photos to display
              </Text>
              <Button
                mode="outlined"
                onPress={onAddPhoto}
                icon="camera-plus"
                style={styles.addButton}
              >
                Add your first photo
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      <PhotoModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  photoGrid: {
    justifyContent: "space-between",
    marginBottom: 8,
  },
  photoContainer: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  visibilityIcon: {
    marginRight: 2,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesText: {
    color: "#fff",
    fontSize: 10,
    marginLeft: 2,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    color: "#888",
    marginVertical: 12,
  },
  addButton: {
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#f0f0f0",
  },
  modalInfo: {
    padding: 16,
  },
  caption: {
    marginBottom: 12,
  },
  modalDetails: {
    marginTop: 8,
  },
  modalDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: "#666",
  },
});

export default PhotoGallery;

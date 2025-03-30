import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useUser } from "../../../context/UserContext";
import { useProfile } from "../../../context/ProfileContext";
import { router } from "expo-router";
import { Card, Button, Divider, Chip, Avatar } from "react-native-paper";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import EventCard from "../../../components/profile/EventCard";
import PhotoGallery from "../../../components/profile/PhotoGallery";
import InterestsSection from "../../../components/profile/InterestsSection";
import FriendsSection from "../../../components/profile/FriendsSection";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const { user } = useUser();
  const {
    profile,
    isLoading,
    events,
    photos,
    friends,
    interests,
    userInterests,
    getVisibleEvents,
    getVisiblePhotos,
  } = useProfile();

  useEffect(() => {
    console.log("ProfileScreen mounted");
    console.log("User:", user);
    console.log("Profile:", profile);
    console.log("IsLoading:", isLoading);
  }, [user, profile, isLoading]);

  const [activeTab, setActiveTab] = useState<
    "about" | "events" | "photos" | "friends"
  >("about");

  if (isLoading) {
    console.log("Profile is still loading...");
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    console.log("Profile is null, even though loading is complete");
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Error: Profile not found</Text>
        <Button mode="contained" onPress={() => router.push("/(tabs)")}>
          Go to Home
        </Button>
      </View>
    );
  }

  // Get events visible to the current user (self)
  const visibleEvents = getVisibleEvents(user?.id);
  const visiblePhotos = getVisiblePhotos(user?.id);

  // Filter user interests
  const userInterestItems = userInterests
    .map((ui) => {
      const interest = interests.find((i) => i.id === ui.interestId);
      return {
        ...ui,
        interest,
      };
    })
    .filter((item) => item.interest !== undefined);

  console.log("Rendering profile for:", profile.name);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <ProfileHeader
        name={profile.name}
        bio={profile.bio}
        profilePicture={profile.profilePicture}
        coverPhoto={profile.coverPhoto}
        location={profile.location}
        joinDate={profile.joinDate}
        onEdit={() => router.push("/(tabs)/profile/edit")}
      />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Button
          mode={activeTab === "about" ? "contained" : "outlined"}
          onPress={() => setActiveTab("about")}
          style={styles.tabButton}
        >
          About
        </Button>
        <Button
          mode={activeTab === "events" ? "contained" : "outlined"}
          onPress={() => setActiveTab("events")}
          style={styles.tabButton}
        >
          Events
        </Button>
        <Button
          mode={activeTab === "photos" ? "contained" : "outlined"}
          onPress={() => setActiveTab("photos")}
          style={styles.tabButton}
        >
          Photos
        </Button>
        <Button
          mode={activeTab === "friends" ? "contained" : "outlined"}
          onPress={() => setActiveTab("friends")}
          style={styles.tabButton}
        >
          Friends
        </Button>
      </View>

      <Divider style={styles.divider} />

      {/* Tab Content */}
      {activeTab === "about" && (
        <View style={styles.sectionContainer}>
          {/* Basic Info */}
          <Card style={styles.card}>
            <Card.Title title="About Me" />
            <Card.Content>
              <Text style={styles.bioText}>
                {profile.bio || "No bio available"}
              </Text>

              {profile.location && (
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={20}
                    color="#666"
                  />
                  <Text style={styles.infoText}>{profile.location}</Text>
                </View>
              )}

              {profile.joinDate && (
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color="#666"
                  />
                  <Text style={styles.infoText}>Joined {profile.joinDate}</Text>
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Interests */}
          <InterestsSection
            interests={userInterestItems}
            onEdit={() => router.push("/(tabs)/profile/interests")}
          />
        </View>
      )}

      {activeTab === "events" && (
        <View style={styles.sectionContainer}>
          <Card style={styles.card}>
            <Card.Title
              title="My Events"
              right={(props) => (
                <Button
                  mode="contained"
                  compact
                  onPress={() => router.push("/(tabs)/calendar")}
                >
                  Calendar
                </Button>
              )}
            />
            <Card.Content>
              {visibleEvents.length > 0 ? (
                visibleEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onPress={() =>
                      router.push(`/(tabs)/calendar/event/${event.id}`)
                    }
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>No events to display</Text>
              )}
            </Card.Content>
          </Card>
        </View>
      )}

      {activeTab === "photos" && (
        <View style={styles.sectionContainer}>
          <PhotoGallery
            photos={visiblePhotos}
            onAddPhoto={() => router.push("/(tabs)/profile/upload-photo")}
          />
        </View>
      )}

      {activeTab === "friends" && (
        <View style={styles.sectionContainer}>
          <FriendsSection
            friends={friends}
            onAddFriend={() => router.push("/(tabs)/profile/add-friend")}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  sectionContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 16,
    fontStyle: "italic",
  },
});

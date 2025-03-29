import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { Button, Text } from "react-native-paper";
import { useUserContext } from "@/context/UserContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import EventCard from "@/components/profile/EventCard";
import PhotoGrid from "@/components/profile/PhotoGrid";
import FriendsList from "@/components/profile/FriendsList";
import InterestTags from "@/components/profile/InterestTags";

export default function ProfileScreen() {
  const { userProfile } = useUserContext();
  const router = useRouter();

  if (!userProfile) {
    return <Text>Loading profile...</Text>;
  }

  // Mock data for profile components
  const interests = [
    { id: "1", name: "Photography" },
    { id: "2", name: "Travel" },
    { id: "3", name: "Music" },
    { id: "4", name: "Hiking" },
    { id: "5", name: "Cooking" },
  ];

  const friends = [
    {
      id: "1",
      name: "Sarah Johnson",
      profilePicture: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: "2",
      name: "Michael Chen",
      profilePicture: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: "3",
      name: "Jessica Lee",
      profilePicture: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: "4",
      name: "David Smith",
      profilePicture: "https://i.pravatar.cc/150?img=4",
    },
  ];

  const photos = [
    { id: "1", uri: "https://picsum.photos/200/300?random=1" },
    { id: "2", uri: "https://picsum.photos/200/300?random=2" },
    { id: "3", uri: "https://picsum.photos/200/300?random=3" },
    { id: "4", uri: "https://picsum.photos/200/300?random=4" },
    { id: "5", uri: "https://picsum.photos/200/300?random=5" },
    { id: "6", uri: "https://picsum.photos/200/300?random=6" },
  ];

  const upcomingEvents = [
    { id: "1", title: "Coffee Meetup", date: "2023-04-15" },
    { id: "2", title: "Team Lunch", date: "2023-04-20" },
  ];

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
          <Text style={styles.sectionTitle}>Recent Events</Text>
          <Link href="/(tabs)/calendar" asChild>
            <Text>See All</Text>
          </Link>
        </View>
        {upcomingEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => console.log(`Event ${event.id} pressed`)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Text>See All</Text>
        </View>
        <PhotoGrid
          photos={photos.slice(0, 6)}
          onPhotoPress={(photo) => {
            console.log(`Photo ${photo.id} pressed`);
          }}
        />
        <Button
          mode="outlined"
          onPress={() => console.log("Upload photos")}
          style={styles.button}
        >
          Upload Photos
        </Button>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Friends</Text>
          <Text>See All</Text>
        </View>
        <FriendsList
          friends={friends.slice(0, 6)}
          onFriendPress={(friend) => console.log(`Friend ${friend.id} pressed`)}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <Text>See All</Text>
        </View>
        <InterestTags
          interests={interests}
          onInterestPress={(interest) => {
            console.log(`Interest ${interest.id} pressed`);
          }}
        />
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

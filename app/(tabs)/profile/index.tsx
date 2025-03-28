import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { Button, Text } from "react-native-paper";
import { useProfileContext } from "../../../context/ProfileContext";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import EventCard from "../../../components/profile/EventCard";
import PhotoGrid from "../../../components/profile/PhotoGrid";
import FriendsList from "../../../components/profile/FriendsList";
import InterestTags from "../../../components/profile/InterestTags";

export default function ProfileScreen() {
  const { profile, events, photos, friends, interests } = useProfileContext();
  const router = useRouter();

  if (!profile) {
    return <Text>Loading profile...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <ProfileHeader
        name={profile.name}
        bio={profile.bio}
        profilePicture={profile.profilePicture}
        onEdit={() => router.push("/(tabs)/edit")}
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Events</Text>
          <Link href="/(tabs)/events" asChild>
            <Text>See All</Text>
          </Link>
        </View>
        {events.slice(0, 3).map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => router.push(`/(tabs)/events/${event.id}`)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Link href="/(tabs)/photos" asChild>
            <Text>See All</Text>
          </Link>
        </View>
        <PhotoGrid
          photos={photos.slice(0, 6)}
          onPhotoPress={(photo: { id: string }) => {
            router.push(`/(tabs)/photos/${photo.id}`);
          }}
        />
        <Button
          mode="outlined"
          onPress={() => router.push("/(tabs)/photos/upload")}
          style={styles.button}
        >
          Upload Photos
        </Button>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Friends</Text>
          <Link href="/(tabs)/friends" asChild>
            <Text>See All</Text>
          </Link>
        </View>
        <FriendsList
          friends={friends.slice(0, 6)}
          onFriendPress={(friend) =>
            router.push(`/(tabs)/friends/${friend.id}`)
          }
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <Link href="/(tabs)/interests" asChild>
            <Text>See All</Text>
          </Link>
        </View>
        <InterestTags
          interests={interests}
          onInterestPress={(interest) => {
            router.push(`/(tabs)/interests/${interest.id}`);
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

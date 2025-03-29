import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useUserContext } from "@/context/UserContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import InterestTags from "@/components/profile/InterestTags";
import PhotoGrid from "@/components/profile/PhotoGrid";
import FriendsList from "@/components/profile/FriendsList";
import EventCard from "@/components/profile/EventCard";

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { userProfile } = useUserContext();

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

  // Event handlers
  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  const handleInterestPress = (interest: any) => {
    console.log("Interest pressed:", interest);
  };

  const handlePhotoPress = (photo: any) => {
    console.log("Photo pressed:", photo);
  };

  const handleFriendPress = (friend: any) => {
    console.log("Friend pressed:", friend);
  };

  const handleEventPress = () => {
    console.log("Event pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "My Profile",
          headerStyle: { backgroundColor: "#4e54c8" },
          headerTintColor: "#fff",
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileHeader
          name={userProfile?.name || "User Name"}
          bio={userProfile?.bio || "No bio available"}
          profilePicture={userProfile?.avatar}
          onEdit={handleEditProfile}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <InterestTags
            interests={interests}
            onInterestPress={handleInterestPress}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <PhotoGrid photos={photos} onPhotoPress={handlePhotoPress} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Friends</Text>
          <FriendsList friends={friends} onFriendPress={handleFriendPress} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={handleEventPress}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
});

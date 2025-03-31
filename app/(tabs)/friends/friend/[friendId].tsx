import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import {
  Appbar,
  Text,
  Avatar,
  Button,
  Card,
  Chip,
  List,
  Divider,
  useTheme,
} from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import { useFriends } from "../../../../context/FriendsContext";
import LoadingScreen from "../../../../components/ui/LoadingScreen";
import EmptyState from "../../../../components/ui/EmptyState";
import MutualEvents from "../../../../components/friends/MutualEvents";

export default function FriendDetailScreen() {
  const theme = useTheme();
  const { friendId } = useLocalSearchParams<{ friendId: string }>();
  const { getFriendById, removeFriend, isLoading } = useFriends();

  // Get the friend's details
  const friend = getFriendById(friendId || "");

  // Handle unfriend action
  const handleUnfriend = async () => {
    if (friend) {
      const success = await removeFriend(friend.id);
      if (success) {
        router.back();
      }
    }
  };

  // View all mutual events
  const viewAllMutualEvents = () => {
    router.push({
      pathname: "/(tabs)/friends/mutual-events/[friendId]",
      params: { friendId: friend?.id || "" },
    });
  };

  if (isLoading) {
    return <LoadingScreen message="Loading friend details..." />;
  }

  if (!friend) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Friend Details" />
        </Appbar.Header>
        <EmptyState
          icon="account-question"
          title="Friend Not Found"
          message="We couldn't find this friend in your list."
          buttonText="Go Back"
          onButtonPress={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Friend Details" />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {friend.profilePicture ? (
            <Avatar.Image
              size={80}
              source={{ uri: friend.profilePicture }}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Text
              size={80}
              label={friend.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
              style={styles.avatar}
            />
          )}

          <Text style={styles.name}>{friend.name}</Text>

          <View style={styles.mutualStats}>
            <View style={styles.statItem}>
              <Text style={styles.statCount}>{friend.mutualFriends || 0}</Text>
              <Text style={styles.statLabel}>Mutual Friends</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statCount}>{friend.mutualEvents || 0}</Text>
              <Text style={styles.statLabel}>Mutual Events</Text>
            </View>
          </View>
        </View>

        {/* More content will go here */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  mutualStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  statCount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  statDivider: {
    height: 24,
    width: 1,
    backgroundColor: "#ddd",
  },
});

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Avatar, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { useFriends } from "../../context/FriendsContext";
import { FriendExtended } from "../../context/FriendsContext";

interface FriendsAttendingProps {
  eventId: string;
  maxDisplay?: number;
}

export default function FriendsAttending({
  eventId,
  maxDisplay = 3,
}: FriendsAttendingProps) {
  const theme = useTheme();
  const { getFriendsAttendingEvent } = useFriends();

  const attendingFriends = getFriendsAttendingEvent(eventId);

  if (!attendingFriends.length) {
    return null;
  }

  // Display a subset of friends with a +X more indicator if needed
  const displayFriends = attendingFriends.slice(0, maxDisplay);
  const remainingCount = attendingFriends.length - displayFriends.length;

  const handlePress = (friend: FriendExtended) => {
    router.push("/(tabs)/profile");
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>
        Friends attending
      </Text>

      <View style={styles.friendsRow}>
        {displayFriends.map((friend) => (
          <TouchableOpacity
            key={friend.id}
            style={styles.friendItem}
            onPress={() => handlePress(friend)}
          >
            {friend.profilePicture ? (
              <Avatar.Image
                size={40}
                source={{ uri: friend.profilePicture }}
                style={styles.avatar}
              />
            ) : (
              <Avatar.Text
                size={40}
                label={friend.name.substring(0, 2).toUpperCase()}
                style={styles.avatar}
              />
            )}
            <Text style={styles.friendName} numberOfLines={1}>
              {friend.name.split(" ")[0]}
            </Text>
          </TouchableOpacity>
        ))}

        {remainingCount > 0 && (
          <View style={styles.remainingContainer}>
            <Avatar.Text
              size={40}
              label={`+${remainingCount}`}
              style={[
                styles.avatar,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
              labelStyle={{ color: theme.colors.onSurfaceVariant }}
            />
            <Text style={styles.friendName}>More</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  friendsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  friendItem: {
    alignItems: "center",
    marginRight: 16,
    maxWidth: 60,
  },
  avatar: {
    marginBottom: 4,
  },
  friendName: {
    fontSize: 12,
    textAlign: "center",
  },
  remainingContainer: {
    alignItems: "center",
    marginRight: 16,
  },
});

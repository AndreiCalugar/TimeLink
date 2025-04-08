import React, { useState } from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";
import {
  Text,
  Appbar,
  Card,
  Avatar,
  Button,
  Chip,
  Divider,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { router } from "expo-router";
import { useFriends } from "../../../context/FriendsContext";
import { FriendSuggestion } from "../../../context/FriendsContext";
import EmptyState from "../../../components/ui/EmptyState";
import AppHeader from "../../../components/ui/AppHeader";

export default function FriendSuggestionsScreen() {
  const theme = useTheme();
  const { friendSuggestions, sendFriendRequest, isLoading } = useFriends();
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);

  const handleSendRequest = async (userId: string) => {
    // Add to pending list first for UI responsiveness
    setPendingRequests((prev) => [...prev, userId]);

    // Send actual request
    const success = await sendFriendRequest(userId);

    // If failed, remove from pending list
    if (!success) {
      setPendingRequests((prev) => prev.filter((id) => id !== userId));
    }
  };

  const renderSuggestionItem = ({ item }: { item: FriendSuggestion }) => {
    const isPending = pendingRequests.includes(item.id);

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.userContainer}>
            {item.profilePicture ? (
              <Avatar.Image
                size={60}
                source={{ uri: item.profilePicture }}
                style={styles.avatar}
              />
            ) : (
              <Avatar.Text
                size={60}
                label={item.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
                style={styles.avatar}
              />
            )}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userBio} numberOfLines={2}>
                {item.bio || ""}
              </Text>
              <View style={styles.mutualInfo}>
                <Text style={styles.mutualText}>
                  {item.mutualFriends} mutual friend
                  {item.mutualFriends !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>
          </View>

          {item.mutualInterests && item.mutualInterests.length > 0 && (
            <View style={styles.interestsContainer}>
              <Text style={styles.interestsLabel}>Mutual interests:</Text>
              <View style={styles.interestChips}>
                {item.mutualInterests.map((interest, index) => (
                  <Chip
                    key={index}
                    style={styles.chip}
                    textStyle={styles.chipText}
                  >
                    {interest}
                  </Chip>
                ))}
              </View>
            </View>
          )}

          <Button
            mode={isPending ? "outlined" : "contained"}
            onPress={() => handleSendRequest(item.id)}
            disabled={isPending}
            style={styles.button}
            loading={isPending}
          >
            {isPending ? "Request Sent" : "Add Friend"}
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <AppHeader
        title="Suggested Friends"
        showBackButton={true}
        backDestination="/(tabs)/friends"
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Finding people you may know...</Text>
        </View>
      ) : friendSuggestions.length > 0 ? (
        <FlatList
          data={friendSuggestions}
          renderItem={renderSuggestionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <EmptyState
          icon="account-search"
          title="No Suggestions Found"
          message="We don't have any friend suggestions for you at the moment. Check back later!"
          buttonText="Go Back"
          onButtonPress={() => router.push("/(tabs)/friends")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 8,
  },
  separator: {
    height: 16,
  },
  userContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  mutualInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  mutualText: {
    fontSize: 12,
    color: "#666",
  },
  interestsContainer: {
    marginBottom: 16,
  },
  interestsLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  interestChips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
  },
  button: {
    marginTop: 8,
  },
});

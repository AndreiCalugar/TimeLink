import React, { useState, useCallback } from "react";
import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import {
  Text,
  Surface,
  useTheme,
  Searchbar,
  Button,
  ActivityIndicator,
  Card,
  Avatar,
  IconButton,
  Chip,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import AppHeader from "../../../components/ui/AppHeader";
import { useFriends } from "../../../context/FriendsContext";
import { FriendExtended, FriendRequest } from "../../../context/FriendsContext";
import EmptyState from "../../../components/ui/EmptyState";

export default function FriendsTabScreen() {
  const theme = useTheme();
  const {
    friends,
    friendRequests,
    isLoading,
    error,
    refreshFriends,
    searchFriends,
    acceptFriendRequest,
    declineFriendRequest,
  } = useFriends();

  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filteredFriends, setFilteredFriends] = useState<FriendExtended[]>([]);
  const [tab, setTab] = useState<"all" | "requests">("all");

  // Refresh friends data when focused, but only on first load or when needed
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        // Only refresh if friends list is empty
        if (friends.length === 0) {
          setRefreshing(true);
          await refreshFriends();
          setRefreshing(false);
        }
      };

      loadData();

      // Return a cleanup function
      return () => {
        // Any cleanup code if needed
      };
    }, [refreshFriends, friends.length])
  );

  // Handle search
  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFriends(friends);
    } else {
      setFilteredFriends(searchFriends(searchQuery));
    }
  }, [searchQuery, friends, searchFriends]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshFriends();
    setRefreshing(false);
  }, [refreshFriends]);

  // Handle friend request responses
  const handleAcceptRequest = async (requestId: string) => {
    await acceptFriendRequest(requestId);
  };

  const handleDeclineRequest = async (requestId: string) => {
    await declineFriendRequest(requestId);
  };

  // Add a function to handle friend card tap
  const handleFriendPress = (friend: FriendExtended) => {
    router.push({
      pathname: "/(tabs)/friends/friend/[friendId]",
      params: { friendId: friend.id },
    });
  };

  // Render each friend item
  const renderFriendItem = ({ item }: { item: FriendExtended }) => (
    <Card style={styles.friendCard} onPress={() => handleFriendPress(item)}>
      <Card.Title
        title={item.name}
        subtitle={`${item.mutualFriends || 0} mutual friends • ${
          item.mutualEvents || 0
        } mutual events`}
        left={(props) => {
          if (item.profilePicture) {
            return (
              <Avatar.Image size={50} source={{ uri: item.profilePicture }} />
            );
          }
          return (
            <Avatar.Text
              size={50}
              label={item.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            />
          );
        }}
        right={(props) => (
          <IconButton
            icon="dots-vertical"
            onPress={() => handleFriendPress(item)}
          />
        )}
      />
      {item.interests && item.interests.length > 0 && (
        <Card.Content style={styles.tagsContainer}>
          {item.interests.slice(0, 3).map((interest, index) => (
            <Chip key={index} style={styles.tag} textStyle={styles.tagText}>
              {interest}
            </Chip>
          ))}
          {item.interests.length > 3 && (
            <Text style={styles.moreText}>
              +{item.interests.length - 3} more
            </Text>
          )}
        </Card.Content>
      )}
      {item.upcomingEvents && item.upcomingEvents.length > 0 && (
        <Card.Actions style={styles.cardActions}>
          <Button
            mode="contained-tonal"
            onPress={() => {
              if (item.upcomingEvents && item.upcomingEvents.length > 0) {
                router.push({
                  pathname: "/(tabs)/friends/mutual-events/[friendId]",
                  params: { friendId: item.id },
                });
              } else {
                router.push("/(tabs)/discover/index");
              }
            }}
          >
            View Events
          </Button>
        </Card.Actions>
      )}
    </Card>
  );

  // Render each friend request item
  const renderRequestItem = ({ item }: { item: FriendRequest }) => (
    <Card style={styles.requestCard}>
      <Card.Title
        title={item.name}
        subtitle={`Requested on ${new Date(
          item.requestDate
        ).toLocaleDateString()}`}
        left={(props) => {
          if (item.profilePicture) {
            return (
              <Avatar.Image size={50} source={{ uri: item.profilePicture }} />
            );
          }
          return (
            <Avatar.Text
              size={50}
              label={item.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            />
          );
        }}
      />
      <Card.Actions style={styles.requestActions}>
        <Button mode="contained" onPress={() => handleAcceptRequest(item.id)}>
          Accept
        </Button>
        <Button mode="outlined" onPress={() => handleDeclineRequest(item.id)}>
          Decline
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["right", "left"]}
    >
      <AppHeader
        title="Friends"
        rightActionIcon="account-plus-outline"
        onRightActionPress={() => router.push("/(tabs)/profile/add-friend")}
        secondaryRightActionIcon="account-search"
        onSecondaryRightActionPress={() =>
          router.push("/(tabs)/friends/suggestions")
        }
      />

      <Surface style={styles.contentContainer} elevation={0}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search friends..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
        </View>

        <View style={styles.tabContainer}>
          <Button
            mode={tab === "all" ? "contained" : "outlined"}
            onPress={() => setTab("all")}
            style={styles.tabButton}
          >
            All Friends
          </Button>
          <Button
            mode={tab === "requests" ? "contained" : "outlined"}
            onPress={() => router.push("/(tabs)/friends/requests")}
            style={styles.tabButton}
          >
            Requests {friendRequests.length > 0 && `(${friendRequests.length})`}
          </Button>
        </View>

        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading friends...</Text>
          </View>
        ) : error ? (
          <EmptyState
            icon="alert-circle-outline"
            title="Couldn't load friends"
            message={error}
            buttonText="Try Again"
            onButtonPress={refreshFriends}
          />
        ) : tab === "all" ? (
          <FlatList
            data={filteredFriends}
            renderItem={renderFriendItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <EmptyState
                icon="account-group-outline"
                title={searchQuery ? "No matches found" : "No friends yet"}
                message={
                  searchQuery
                    ? `No friends matching "${searchQuery}"`
                    : "Add friends to see them here"
                }
                buttonText="Add Friends"
                onButtonPress={() => router.push("/(tabs)/profile/add-friend")}
              />
            }
          />
        ) : (
          <FlatList
            data={friendRequests}
            renderItem={renderRequestItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <EmptyState
                icon="account-check-outline"
                title="No friend requests"
                message="When someone sends you a friend request, it will appear here"
                buttonText="Find Friends"
                onButtonPress={() => router.push("/(tabs)/profile/add-friend")}
              />
            }
          />
        )}
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    elevation: 1,
  },
  tabContainer: {
    flexDirection: "row",
    padding: 16,
    paddingTop: 0,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
  },
  friendCard: {
    marginBottom: 0,
  },
  requestCard: {
    marginBottom: 0,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 8,
    alignItems: "center",
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
  },
  moreText: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  cardActions: {
    justifyContent: "flex-end",
  },
  requestActions: {
    justifyContent: "flex-end",
  },
});

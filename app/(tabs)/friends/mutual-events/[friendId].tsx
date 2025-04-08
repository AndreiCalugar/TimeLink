import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, Appbar, useTheme } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import { useDiscovery } from "../../../../context/DiscoveryContext";
import { useFriends } from "../../../../context/FriendsContext";
import EmptyState from "../../../../components/ui/EmptyState";
import LoadingScreen from "../../../../components/ui/LoadingScreen";
import DiscoveryEventCard from "../../../../components/discovery/DiscoveryEventCard";
import AppHeader from "../../../../components/ui/AppHeader";

export default function MutualEventsScreen() {
  const theme = useTheme();
  const { friendId } = useLocalSearchParams<{ friendId: string }>();
  const { events, isLoading } = useDiscovery();
  const { getFriendById } = useFriends();

  // Get friend details
  const friend = getFriendById(friendId || "");

  // Filter events to find those the friend is attending
  const mutualEvents = events.filter((event) =>
    event.friendsAttending?.some((friend) => friend.id === friendId)
  );

  const handleEventPress = (eventId: string) => {
    router.push({
      pathname: "/(tabs)/calendar/event/[id]",
      params: { id: eventId },
    });
  };

  if (isLoading) {
    return <LoadingScreen message="Loading events..." />;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <AppHeader
        title={
          friend ? `Events with ${friend.name.split(" ")[0]}` : "Mutual Events"
        }
        showBackButton={true}
        backDestination={`/(tabs)/friends/friend/${friendId}`}
      />

      {mutualEvents.length === 0 ? (
        <EmptyState
          icon="calendar-blank"
          title="No Mutual Events"
          message={
            friend
              ? `You don't have any events in common with ${friend.name} yet.`
              : "You don't have any mutual events with this friend yet."
          }
          buttonText="Find Events"
          onButtonPress={() => router.push("/(tabs)/discover")}
        />
      ) : (
        <FlatList
          data={mutualEvents}
          renderItem={({ item }) => (
            <DiscoveryEventCard
              event={item}
              onPress={() => handleEventPress(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.eventsList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventsList: {
    padding: 16,
  },
  separator: {
    height: 16,
  },
});

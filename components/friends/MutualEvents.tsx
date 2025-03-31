import React from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { Text, Card, Chip, Avatar, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { useDiscovery } from "../../context/DiscoveryContext";
import { DiscoveryEvent } from "../../context/DiscoveryContext";
import EmptyState from "../ui/EmptyState";

interface MutualEventsProps {
  friendId: string;
  maxEvents?: number;
  showViewAll?: boolean;
}

export default function MutualEvents({
  friendId,
  maxEvents = 3,
  showViewAll = true,
}: MutualEventsProps) {
  const theme = useTheme();
  const { getMutualEvents } = useDiscovery();

  // Get mutual events from the discovery context
  const mutualEvents = getMutualEvents(friendId);

  // Show only the first few events if maxEvents is set
  const displayEvents = maxEvents
    ? mutualEvents.slice(0, maxEvents)
    : mutualEvents;
  const hasMore = mutualEvents.length > displayEvents.length;

  // Format the date for display
  const formatEventDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);

      if (isToday(date)) {
        return "Today";
      } else if (isTomorrow(date)) {
        return "Tomorrow";
      } else {
        return format(date, "EEE, MMM d"); // e.g., "Mon, Jan 1"
      }
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";

    try {
      // Convert 24h format to 12h format
      const [hour, minute] = timeString.split(":");
      const hourNum = parseInt(hour, 10);
      const period = hourNum >= 12 ? "PM" : "AM";
      const hour12 = hourNum % 12 || 12;

      return `${hour12}:${minute} ${period}`;
    } catch (error) {
      return timeString;
    }
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/(tabs)/discover/event/${eventId}`);
  };

  const renderEventItem = ({ item }: { item: DiscoveryEvent }) => (
    <Card style={styles.eventCard} onPress={() => handleEventPress(item.id)}>
      <Card.Content style={styles.eventContent}>
        {item.image ? (
          <Avatar.Image
            size={50}
            source={{ uri: item.image }}
            style={styles.eventImage}
          />
        ) : (
          <Avatar.Icon
            size={50}
            icon="calendar"
            style={[
              styles.eventImage,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          />
        )}

        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.dateTimeRow}>
            <MaterialCommunityIcons
              name="calendar"
              size={14}
              color={theme.colors.onSurfaceVariant}
              style={styles.icon}
            />
            <Text style={styles.dateTimeText}>
              {formatEventDate(item.date)}
              {item.startTime && ` • ${formatTime(item.startTime)}`}
            </Text>
          </View>

          {item.location && (
            <View style={styles.locationRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={14}
                color={theme.colors.onSurfaceVariant}
                style={styles.icon}
              />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          )}
        </View>

        {item.category && (
          <Chip
            mode="outlined"
            style={styles.categoryChip}
            textStyle={styles.chipText}
          >
            {item.category}
          </Chip>
        )}
      </Card.Content>
    </Card>
  );

  if (mutualEvents.length === 0) {
    return (
      <EmptyState
        icon="calendar-blank"
        title="No Mutual Events"
        message="You don't have any events in common with this friend yet."
        compact
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={displayEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />

      {hasMore && showViewAll && (
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() =>
            router.push(`/(tabs)/friends/mutual-events/${friendId}`)
          }
        >
          <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
            View all {mutualEvents.length} events
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={16}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  listContent: {
    paddingTop: 4,
  },
  eventCard: {
    marginBottom: 4,
    elevation: 1,
  },
  eventContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  eventImage: {
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 4,
  },
  dateTimeText: {
    fontSize: 12,
  },
  locationText: {
    fontSize: 12,
  },
  categoryChip: {
    height: 24,
    marginLeft: 8,
  },
  chipText: {
    fontSize: 10,
  },
  separator: {
    height: 8,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  viewAllText: {
    fontSize: 14,
    marginRight: 4,
    fontWeight: "500",
  },
});

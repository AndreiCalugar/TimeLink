import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text, Card, Chip, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DiscoveryEvent } from "../../context/DiscoveryContext";
import { format, isToday, isTomorrow } from "date-fns";

interface DiscoveryEventCardProps {
  event: DiscoveryEvent;
  onPress: () => void;
}

export default function DiscoveryEventCard({
  event,
  onPress,
}: DiscoveryEventCardProps) {
  const theme = useTheme();

  // Format the date for display
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);

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

  return (
    <Card style={styles.card} onPress={onPress}>
      {/* Event Image */}
      {event.image && (
        <Card.Cover source={{ uri: event.image }} style={styles.image} />
      )}

      <Card.Content style={styles.content}>
        {/* Title and basic info */}
        <Text style={styles.title}>{event.title}</Text>

        <View style={styles.detailsRow}>
          <MaterialCommunityIcons
            name="calendar"
            size={16}
            color="#666"
            style={styles.icon}
          />
          <Text style={styles.dateTime}>
            {formatEventDate(event.date)}
            {event.startTime && ` • ${formatTime(event.startTime)}`}
            {event.endTime && ` - ${formatTime(event.endTime)}`}
          </Text>
        </View>

        {event.location && (
          <View style={styles.detailsRow}>
            <MaterialCommunityIcons
              name="map-marker"
              size={16}
              color="#666"
              style={styles.icon}
            />
            <Text style={styles.location} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        )}

        {/* Description */}
        {event.description && (
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        )}

        {/* Bottom row with attendance info and categories */}
        <View style={styles.bottomRow}>
          {/* Attendance info */}
          <View style={styles.attendanceInfo}>
            {event.attendingCount !== undefined && event.attendingCount > 0 && (
              <Chip icon="account-group" style={styles.chip}>
                {event.attendingCount} attending
              </Chip>
            )}

            {event.friendsAttending && event.friendsAttending.length > 0 && (
              <View style={styles.friendsAttending}>
                <MaterialCommunityIcons
                  name="account-multiple"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.friendsText, { color: theme.colors.primary }]}
                >
                  {event.friendsAttending.length} friend
                  {event.friendsAttending.length > 1 ? "s" : ""}
                </Text>
              </View>
            )}
          </View>

          {/* Category tag */}
          {event.category && (
            <Chip mode="outlined" style={styles.categoryChip}>
              {event.category}
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  image: {
    height: 160,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  icon: {
    marginRight: 6,
  },
  dateTime: {
    fontSize: 14,
    color: "#666",
  },
  location: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  description: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 12,
    color: "#333",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  attendanceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
    height: 30,
  },
  friendsAttending: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  friendsText: {
    fontSize: 12,
    marginLeft: 4,
  },
  categoryChip: {
    height: 30,
    backgroundColor: "transparent",
  },
});

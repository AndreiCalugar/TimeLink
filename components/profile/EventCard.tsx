import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text, Chip, Card, Avatar } from "react-native-paper";
import { Event } from "../../types/profile";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  // Format the date
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Get the visibility icon
  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "earth";
      case "friends":
        return "account-group";
      case "private":
        return "lock";
      default:
        return "earth";
    }
  };

  return (
    <Card style={styles.container} onPress={onPress}>
      <View style={styles.contentContainer}>
        {event.image && (
          <Image
            source={{ uri: event.image }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.infoContainer}>
          <Text variant="titleMedium" style={styles.title}>
            {event.title}
          </Text>

          <View style={styles.detailsRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="#666" />
            <Text variant="bodyMedium" style={styles.detailText}>
              {formatEventDate(event.date)}
            </Text>
          </View>

          {event.location && (
            <View style={styles.detailsRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color="#666"
              />
              <Text variant="bodyMedium" style={styles.detailText}>
                {event.location}
              </Text>
            </View>
          )}

          <View style={styles.footer}>
            <Chip
              icon={() => (
                <MaterialCommunityIcons
                  name={getVisibilityIcon(event.visibility)}
                  size={16}
                  color="#666"
                />
              )}
              style={styles.visibilityChip}
            >
              {event.visibility.charAt(0).toUpperCase() +
                event.visibility.slice(1)}
            </Chip>

            {event.attendees && event.attendees.length > 0 && (
              <View style={styles.attendeesContainer}>
                <Text variant="bodySmall" style={styles.attendeesText}>
                  {event.attendees.length}{" "}
                  {event.attendees.length === 1 ? "attendee" : "attendees"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    overflow: "hidden",
  },
  contentContainer: {
    flexDirection: "row",
    padding: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "600",
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 6,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  visibilityChip: {
    height: 26,
  },
  attendeesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  attendeesText: {
    color: "#888",
  },
});

export default EventCard;

import React from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import { Text, Avatar, Surface, Badge } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CalendarEvent, EventVisibility } from "@/context/CalendarContext";

// Define visibility icon mapping with proper types
const visibilityIcons: Record<EventVisibility, any> = {
  public: "earth",
  friends: "account-group",
  private: "lock",
};

// Define props interface
interface EventCardProps {
  event: CalendarEvent;
  onPress: (id: string) => void;
  compact?: boolean;
}

export default function EventCard({
  event,
  onPress,
  compact = false,
}: EventCardProps) {
  // Get the first letter of the event title for the avatar
  const firstLetter = event.title.charAt(0).toUpperCase();

  // Determine the color for the avatar background
  const avatarBackgroundColor = event.color || "#4285F4";

  // Get the visibility icon
  const visibilityIcon = visibilityIcons[event.visibility];

  const renderCompactView = () => {
    return (
      <Surface
        style={[
          styles.compactContainer,
          {
            borderLeftColor: event.color || "#4285F4",
            borderStyle: event.isDeadTime ? "dashed" : "solid",
          },
        ]}
        elevation={1}
      >
        <View style={styles.compactContent}>
          <Text numberOfLines={1} style={styles.compactTitle}>
            {event.title}
          </Text>
          {(event.startTime || event.endTime) && (
            <Text style={styles.compactTime}>
              {event.startTime} - {event.endTime}
            </Text>
          )}
        </View>
        {event.isDeadTime && <Badge style={styles.deadTimeBadge} size={8} />}
      </Surface>
    );
  };

  const renderFullView = () => {
    return (
      <Surface
        style={[
          styles.container,
          {
            borderLeftColor: event.color || "#4285F4",
            borderStyle: event.isDeadTime ? "dashed" : "solid",
          },
        ]}
        elevation={2}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Avatar.Text
              size={36}
              label={firstLetter}
              style={{ backgroundColor: avatarBackgroundColor }}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{event.title}</Text>
            <View style={styles.metaContainer}>
              {event.location && (
                <View style={styles.metaItem}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={14}
                    color="#757575"
                  />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {event.location}
                  </Text>
                </View>
              )}
              {(event.startTime || event.endTime) && (
                <View style={styles.metaItem}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={14}
                    color="#757575"
                  />
                  <Text style={styles.metaText}>
                    {event.startTime} - {event.endTime}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <MaterialCommunityIcons
            name={visibilityIcon}
            size={18}
            color="#757575"
            style={styles.visibilityIcon}
          />
        </View>

        {event.description && (
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        )}

        {event.isDeadTime && (
          <View style={styles.deadTimeContainer}>
            <Badge style={styles.deadTimeBadge} />
            <Text style={styles.deadTimeText}>Dead Time</Text>
          </View>
        )}
      </Surface>
    );
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(event.id)}
      style={compact ? styles.compactTouchable : styles.touchable}
      activeOpacity={0.7}
    >
      {compact ? renderCompactView() : renderFullView()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 12,
  },
  compactTouchable: {
    marginBottom: 6,
  },
  container: {
    borderRadius: 8,
    borderLeftWidth: 4,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  compactContainer: {
    borderRadius: 4,
    borderLeftWidth: 4,
    backgroundColor: "#fff",
    padding: 8,
  },
  header: {
    flexDirection: "row",
    padding: 12,
    paddingBottom: 12,
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  metaContainer: {
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: "#757575",
    marginLeft: 4,
  },
  visibilityIcon: {
    marginLeft: 8,
  },
  description: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontSize: 14,
    color: "#757575",
  },
  deadTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(234, 67, 53, 0.1)",
    padding: 6,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  deadTimeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#EA4335",
    marginLeft: 4,
  },
  deadTimeBadge: {
    backgroundColor: "#EA4335",
  },
  compactContent: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  compactTime: {
    fontSize: 11,
    color: "#757575",
  },
});

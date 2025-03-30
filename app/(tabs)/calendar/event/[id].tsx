import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
  Platform,
} from "react-native";
import {
  Text,
  Button,
  Chip,
  useTheme,
  Portal,
  Dialog,
  IconButton,
  Divider,
  Surface,
  Avatar,
} from "react-native-paper";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useCalendarContext } from "../../../../context/CalendarContext";
import { format, parse, isToday, isPast, isFuture } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import EventAttendees from "../../../../components/calendar/EventAttendees";

// Define valid routes for type safety
const Routes = {
  editEvent: (id: string) => `/calendar/edit/${id}` as const,
};

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const { getEventById, deleteEvent } = useCalendarContext();
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const event = getEventById(id as string);

  if (!event) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Event Not Found" }} />
        <Text style={styles.notFoundText}>Event not found</Text>
        <Button mode="contained" onPress={() => router.back()}>
          Back to Calendar
        </Button>
      </View>
    );
  }

  // Format date with fallback for invalid dates
  const formatEventDate = () => {
    try {
      const eventDate = parse(event.date, "yyyy-MM-dd", new Date());
      return format(eventDate, "EEEE, MMMM d, yyyy");
    } catch (error) {
      return event.date; // Fallback to the original string
    }
  };

  const formattedDate = formatEventDate();

  // Determine event status based on date
  const getEventStatus = () => {
    try {
      const eventDate = parse(event.date, "yyyy-MM-dd", new Date());
      if (isToday(eventDate)) return "today";
      if (isPast(eventDate)) return "past";
      if (isFuture(eventDate)) return "upcoming";
      return "upcoming";
    } catch (error) {
      return "upcoming";
    }
  };

  const eventStatus = getEventStatus();

  // Get event time period display
  const getTimePeriod = () => {
    if (!event.startTime && !event.endTime) return "All day";
    return `${event.startTime || ""} - ${event.endTime || ""}`;
  };

  // Handle event deletion with confirmation
  const showDeleteConfirmation = () => {
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirmed = async () => {
    setDeleteDialogVisible(false);
    await deleteEvent(event.id);
    router.back();
  };

  // Handle navigation to edit screen
  const handleEdit = () => {
    router.push(Routes.editEvent(event.id) as any);
  };

  // Handle sharing event
  const handleShare = async () => {
    try {
      const eventDetails = `Event: ${
        event.title
      }\nDate: ${formattedDate}\nTime: ${getTimePeriod()}\n${
        event.location ? `Location: ${event.location}\n` : ""
      }`;

      await Share.share({
        message: eventDetails,
        title: event.title,
      });
    } catch (error) {
      console.error("Error sharing event:", error);
    }
  };

  // Determine the event header color
  const headerColor = event.color || theme.colors.primary;

  // Visibility icon mapping
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
    <>
      <Stack.Screen
        options={{
          title: "Event Details",
          headerStyle: { backgroundColor: headerColor },
          headerTintColor: "#fff",
        }}
      />
      <ScrollView style={styles.container}>
        <Surface style={[styles.eventHeader, { backgroundColor: headerColor }]}>
          <View style={styles.avatarContainer}>
            <Avatar.Text
              size={60}
              label={event.title.charAt(0).toUpperCase()}
              color="#fff"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            />
          </View>
          <Text
            style={[styles.headerTitle, { fontSize: 24, fontWeight: "bold" }]}
          >
            {event.title}
          </Text>

          <View style={styles.statusRow}>
            <Chip
              style={styles.statusChip}
              textStyle={{ color: "#fff" }}
              icon={getVisibilityIcon(event.visibility)}
            >
              {event.visibility}
            </Chip>

            {event.isDeadTime && (
              <Chip
                style={styles.deadTimeChip}
                textStyle={{ color: "#fff" }}
                icon="clock-remove-outline"
              >
                Dead Time
              </Chip>
            )}

            <Chip
              style={[
                styles.statusChip,
                {
                  backgroundColor:
                    eventStatus === "today"
                      ? "#4caf50"
                      : eventStatus === "past"
                      ? "#9e9e9e"
                      : "#2196f3",
                },
              ]}
              textStyle={{ color: "#fff" }}
              icon={
                eventStatus === "today"
                  ? "calendar-today"
                  : eventStatus === "past"
                  ? "calendar-arrow-left"
                  : "calendar-arrow-right"
              }
            >
              {eventStatus === "today"
                ? "Today"
                : eventStatus === "past"
                ? "Past"
                : "Upcoming"}
            </Chip>
          </View>
        </Surface>

        <View style={styles.detailsCard}>
          <View style={styles.detailSection}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="calendar"
                size={22}
                color={theme.colors.primary}
                style={styles.detailIcon}
              />
              <Text style={{ fontSize: 16 }}>{formattedDate}</Text>
            </View>

            {(event.startTime || event.endTime) && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={22}
                  color={theme.colors.primary}
                  style={styles.detailIcon}
                />
                <Text style={{ fontSize: 16 }}>{getTimePeriod()}</Text>
              </View>
            )}

            {event.location && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={22}
                  color={theme.colors.primary}
                  style={styles.detailIcon}
                />
                <Text style={{ fontSize: 16 }}>{event.location}</Text>
              </View>
            )}
          </View>

          <Divider style={styles.divider} />

          {event.description && (
            <View style={styles.descriptionSection}>
              <Text
                style={[
                  styles.sectionTitle,
                  { fontWeight: "bold", fontSize: 16 },
                ]}
              >
                Description
              </Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <>
              <Divider style={styles.divider} />
              <EventAttendees attendees={event.attendees} readonly={true} />
            </>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleEdit}
            style={styles.button}
            icon="pencil"
          >
            Edit Event
          </Button>

          <Button
            mode="contained"
            onPress={handleShare}
            style={[styles.button, { backgroundColor: "#009688" }]}
            icon="share-variant"
          >
            Share Event
          </Button>

          <Button
            mode="outlined"
            onPress={showDeleteConfirmation}
            textColor={theme.colors.error}
            style={[styles.button, styles.deleteButton]}
            icon="delete"
          >
            Delete Event
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Event</Dialog.Title>
          <Dialog.Content>
            <Text style={{ fontSize: 14 }}>
              Are you sure you want to delete "{event.title}"? This action
              cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              textColor={theme.colors.error}
              onPress={handleDeleteConfirmed}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  notFoundText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  eventHeader: {
    padding: 24,
    alignItems: "center",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
  },
  statusChip: {
    margin: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  deadTimeChip: {
    margin: 4,
    backgroundColor: "#f44336",
  },
  detailsCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  detailSection: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailIcon: {
    marginRight: 12,
  },
  divider: {
    marginVertical: 16,
  },
  descriptionSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    lineHeight: 22,
  },
  actions: {
    padding: 16,
    marginBottom: 24,
  },
  button: {
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: "rgba(235, 87, 87, 0.3)",
  },
});

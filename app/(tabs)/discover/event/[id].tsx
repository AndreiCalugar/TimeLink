import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Share,
  Alert,
} from "react-native";
import {
  Text,
  Button,
  Chip,
  useTheme,
  Divider,
  ActivityIndicator,
  Portal,
  Dialog,
  Avatar,
  IconButton,
  Surface,
} from "react-native-paper";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useDiscovery } from "../../../../context/DiscoveryContext";
import { format, isToday, isPast, isFuture, parseISO } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FriendsAttending from "../../../../components/discovery/FriendsAttending";
import { useFriends } from "../../../../context/FriendsContext";
import { DiscoveryEvent } from "../../../../context/DiscoveryContext";
import { useUser } from "../../../../context/UserContext";
import EmptyState from "../../../../components/ui/EmptyState";

type RsvpStatus = "going" | "maybe" | "not-going" | "none";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const { events } = useDiscovery();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [rsvpDialogVisible, setRsvpDialogVisible] = useState(false);
  const [userRsvp, setUserRsvp] = useState<RsvpStatus>("none");

  // Find the event in the discovery events
  const event = events.find((e) => e.id === id) as DiscoveryEvent | undefined;

  // Check if the current user is already attending
  React.useEffect(() => {
    if (event && user) {
      // In a real app, this would check against actual RSVPs data
      const isAttending = event.attendees?.includes(user.id);
      setUserRsvp(isAttending ? "going" : "none");
    }
  }, [event, user]);

  // Handle RSVP actions
  const handleRsvp = async (status: RsvpStatus) => {
    setIsLoading(true);
    setRsvpDialogVisible(false);

    try {
      // In a real app, this would make an API call to update RSVP status
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUserRsvp(status);

      // Show confirmation message
      Alert.alert(
        status === "going"
          ? "You're going!"
          : status === "maybe"
          ? "Maybe attending"
          : "Not attending",
        status === "going"
          ? "You've been added to the attendee list."
          : status === "maybe"
          ? "You've been added to the maybe list."
          : "You've been removed from the attendee list."
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update RSVP status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sharing the event
  const handleShareEvent = async () => {
    if (!event) return;

    try {
      const formatTime = (timeString?: string) => {
        if (!timeString) return "";
        return timeString;
      };

      const eventDateTime = `${format(
        parseISO(event.date),
        "EEEE, MMMM d, yyyy"
      )}`;
      const eventTime = event.startTime
        ? ` at ${formatTime(event.startTime)}${
            event.endTime ? ` - ${formatTime(event.endTime)}` : ""
          }`
        : "";

      await Share.share({
        message: `Check out this event: ${
          event.title
        }\n${eventDateTime}${eventTime}\n${
          event.location ? `Location: ${event.location}\n` : ""
        }${event.description || ""}`,
        title: event.title,
      });
    } catch (error) {
      console.error("Error sharing event:", error);
    }
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Event Not Found"
          message="The event you're looking for doesn't exist or has been removed."
          icon="calendar-remove"
          buttonText="Back to Discover"
          onButtonPress={() => router.back()}
        />
      </View>
    );
  }

  // Format date with fallback for invalid dates
  const formatEventDate = () => {
    try {
      return format(parseISO(event.date), "EEEE, MMMM d, yyyy");
    } catch (error) {
      return event.date; // Fallback to the original string
    }
  };

  // Get formatted time
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

  // Get time display
  const getTimeDisplay = () => {
    if (!event.startTime && !event.endTime) return "All day";

    let timeDisplay = "";
    if (event.startTime) timeDisplay += formatTime(event.startTime);
    if (event.endTime) timeDisplay += ` - ${formatTime(event.endTime)}`;
    return timeDisplay;
  };

  // Determine event status
  const getEventStatus = () => {
    try {
      const eventDate = parseISO(event.date);
      if (isToday(eventDate)) return "today";
      if (isPast(eventDate)) return "past";
      if (isFuture(eventDate)) return "upcoming";
      return "upcoming";
    } catch (error) {
      return "upcoming";
    }
  };

  const eventStatus = getEventStatus();
  const isPastEvent = eventStatus === "past";

  // RSVP button state
  const getRsvpButtonLabel = () => {
    switch (userRsvp) {
      case "going":
        return "Going";
      case "maybe":
        return "Maybe";
      case "not-going":
        return "Not Going";
      default:
        return "RSVP";
    }
  };

  const getRsvpButtonIcon = () => {
    switch (userRsvp) {
      case "going":
        return "check-circle";
      case "maybe":
        return "help-circle";
      case "not-going":
        return "close-circle";
      default:
        return "calendar-plus";
    }
  };

  const getRsvpButtonColor = () => {
    switch (userRsvp) {
      case "going":
        return theme.colors.primary;
      case "maybe":
        return theme.colors.secondary;
      case "not-going":
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Event Details",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerRight: () => (
            <IconButton
              icon="pencil"
              iconColor="#fff"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/discover/edit/[id]",
                  params: { id },
                })
              }
            />
          ),
        }}
      />

      <ScrollView style={styles.container}>
        {/* Event Header/Image */}
        {event.image ? (
          <Image source={{ uri: event.image }} style={styles.coverImage} />
        ) : (
          <View
            style={[
              styles.coverPlaceholder,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <MaterialCommunityIcons
              name="calendar-star"
              size={60}
              color="#fff"
            />
          </View>
        )}

        {/* Event Title and Quick Info */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.categoryRow}>
            {event.category && (
              <Chip mode="outlined" style={styles.categoryChip}>
                {event.category}
              </Chip>
            )}

            <Chip
              icon={
                eventStatus === "today"
                  ? "calendar-today"
                  : eventStatus === "past"
                  ? "calendar-arrow-left"
                  : "calendar-arrow-right"
              }
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
            >
              {eventStatus === "today"
                ? "Today"
                : eventStatus === "past"
                ? "Past"
                : "Upcoming"}
            </Chip>
          </View>
        </View>

        <View style={styles.detailsCard}>
          {/* Date and Time */}
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="calendar"
              size={22}
              color={theme.colors.primary}
              style={styles.detailIcon}
            />
            <View>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailText}>{formatEventDate()}</Text>
              {(event.startTime || event.endTime) && (
                <Text style={styles.detailText}>{getTimeDisplay()}</Text>
              )}
            </View>
          </View>

          {/* Location */}
          {event.location && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={22}
                color={theme.colors.primary}
                style={styles.detailIcon}
              />
              <View>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailText}>{event.location}</Text>
              </View>
            </View>
          )}

          {/* Attendance */}
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="account-group"
              size={22}
              color={theme.colors.primary}
              style={styles.detailIcon}
            />
            <View>
              <Text style={styles.detailLabel}>Attendance</Text>
              <Text style={styles.detailText}>
                {event.attendingCount || 0} people attending
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Event Description */}
          {event.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>About this event</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>
          )}

          {/* Friends Attending Section */}
          {event.friendsAttending && event.friendsAttending.length > 0 && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.sectionTitle}>Friends Attending</Text>
              <FriendsAttending eventId={event.id} maxDisplay={5} />
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            mode={userRsvp === "none" ? "contained" : "contained-tonal"}
            icon={getRsvpButtonIcon()}
            onPress={() => setRsvpDialogVisible(true)}
            style={[styles.button, { backgroundColor: getRsvpButtonColor() }]}
            disabled={isPastEvent || isLoading}
          >
            {isLoading ? "Processing..." : getRsvpButtonLabel()}
          </Button>

          <Button
            mode="outlined"
            icon="share-variant"
            onPress={handleShareEvent}
            style={styles.button}
          >
            Share Event
          </Button>
        </View>
      </ScrollView>

      {/* RSVP Dialog */}
      <Portal>
        <Dialog
          visible={rsvpDialogVisible}
          onDismiss={() => setRsvpDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>RSVP to Event</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Would you like to attend "{event.title}"?
            </Text>

            <View style={styles.rsvpOptions}>
              <Button
                mode="contained"
                icon="check-circle"
                style={[
                  styles.rsvpButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => handleRsvp("going")}
              >
                Going
              </Button>

              <Button
                mode="contained"
                icon="help-circle"
                style={[
                  styles.rsvpButton,
                  { backgroundColor: theme.colors.secondary },
                ]}
                onPress={() => handleRsvp("maybe")}
              >
                Maybe
              </Button>

              <Button
                mode="contained"
                icon="close-circle"
                style={[
                  styles.rsvpButton,
                  { backgroundColor: theme.colors.error },
                ]}
                onPress={() => handleRsvp("not-going")}
              >
                Not Going
              </Button>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setRsvpDialogVisible(false)}>Cancel</Button>
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
  coverImage: {
    width: "100%",
    height: 240,
  },
  coverPlaceholder: {
    width: "100%",
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  statusChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  detailsCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  detailIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  detailText: {
    fontSize: 16,
  },
  divider: {
    marginVertical: 16,
  },
  descriptionSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    marginBottom: 12,
  },
  dialog: {
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  dialogText: {
    fontSize: 16,
    marginBottom: 20,
  },
  rsvpOptions: {
    flexDirection: "column",
    marginTop: 8,
  },
  rsvpButton: {
    marginBottom: 12,
  },
});

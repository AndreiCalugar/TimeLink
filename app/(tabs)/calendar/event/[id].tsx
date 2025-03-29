import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Chip, useTheme } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCalendarContext } from "../../../../context/CalendarContext";
import { format, parse } from "date-fns";

// Define valid routes for type safety
const Routes = {
  editEvent: (id: string) => `/calendar/edit/${id}` as const,
};

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const { getEventById, deleteEvent } = useCalendarContext();

  const event = getEventById(id as string);

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Event not found</Text>
        <Button mode="contained" onPress={() => router.back()}>
          Back to Calendar
        </Button>
      </View>
    );
  }

  // Format date and time with date-fns
  const eventDate = parse(event.date, "yyyy-MM-dd", new Date());
  const formattedDate = format(eventDate, "EEEE, MMMM d, yyyy");

  // Handle event deletion
  const handleDelete = async () => {
    await deleteEvent(event.id);
    router.back();
  };

  // Handle navigation to edit screen
  const handleEdit = () => {
    // Here we're working around the type system by using any
    router.push(Routes.editEvent(event.id) as any);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          {event.title}
        </Text>

        <Chip
          style={[
            styles.visibilityChip,
            { backgroundColor: theme.colors.secondaryContainer },
          ]}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
        >
          {event.visibility}
        </Chip>

        {event.isDeadTime && (
          <Chip
            style={[
              styles.deadTimeChip,
              { backgroundColor: theme.colors.errorContainer },
            ]}
            textStyle={{ color: theme.colors.onErrorContainer }}
          >
            Dead Time
          </Chip>
        )}
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text variant="labelLarge" style={styles.label}>
            Date:
          </Text>
          <Text variant="bodyLarge">{formattedDate}</Text>
        </View>

        {(event.startTime || event.endTime) && (
          <View style={styles.detailRow}>
            <Text variant="labelLarge" style={styles.label}>
              Time:
            </Text>
            <Text variant="bodyLarge">
              {`${event.startTime || ""} - ${event.endTime || ""}`}
            </Text>
          </View>
        )}

        {event.location && (
          <View style={styles.detailRow}>
            <Text variant="labelLarge" style={styles.label}>
              Location:
            </Text>
            <Text variant="bodyLarge">{event.location}</Text>
          </View>
        )}

        {event.description && (
          <View style={styles.description}>
            <Text variant="labelLarge" style={styles.label}>
              Description:
            </Text>
            <Text variant="bodyMedium">{event.description}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <Button mode="contained" onPress={handleEdit} style={styles.button}>
          Edit Event
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          textColor={theme.colors.error}
          style={[styles.button, styles.deleteButton]}
        >
          Delete Event
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  visibilityChip: {
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  deadTimeChip: {
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  details: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  label: {
    width: 80,
    fontWeight: "bold",
  },
  description: {
    marginTop: 12,
  },
  actions: {
    marginTop: 16,
  },
  button: {
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: "rgba(235, 87, 87, 0.3)",
  },
});

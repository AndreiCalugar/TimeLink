import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Text, Chip, useTheme } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  useCalendarContext,
  EventVisibility,
} from "../../../context/CalendarContext";

export default function CreateEventScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();
  const { createEvent } = useCalendarContext();

  // Get the date from params or use today
  const initialDate =
    (params.date as string) || new Date().toISOString().split("T")[0];

  // Event state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState<EventVisibility>("public");
  const [isDeadTime, setIsDeadTime] = useState(false);

  // Handle form submission
  const handleCreateEvent = async () => {
    // Validate form
    if (!title.trim()) {
      // Show error - title is required
      return;
    }

    await createEvent({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      visibility,
      isDeadTime,
      color: isDeadTime
        ? "#EA4335"
        : visibility === "public"
        ? "#4285F4"
        : visibility === "friends"
        ? "#34A853"
        : "#FBBC05",
    });

    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Create New Event
      </Text>

      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        label="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />

      <View style={styles.timeContainer}>
        <TextInput
          label="Start Time"
          value={startTime}
          onChangeText={setStartTime}
          style={[styles.input, styles.timeInput]}
          placeholder="HH:MM"
        />

        <TextInput
          label="End Time"
          value={endTime}
          onChangeText={setEndTime}
          style={[styles.input, styles.timeInput]}
          placeholder="HH:MM"
        />
      </View>

      <TextInput
        label="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Visibility
      </Text>

      <View style={styles.visibilityContainer}>
        <Chip
          selected={visibility === "public"}
          onPress={() => setVisibility("public")}
          style={[
            styles.chip,
            visibility === "public" && {
              backgroundColor: theme.colors.primaryContainer,
            },
          ]}
        >
          Public
        </Chip>

        <Chip
          selected={visibility === "friends"}
          onPress={() => setVisibility("friends")}
          style={[
            styles.chip,
            visibility === "friends" && {
              backgroundColor: theme.colors.primaryContainer,
            },
          ]}
        >
          Friends Only
        </Chip>

        <Chip
          selected={visibility === "private"}
          onPress={() => setVisibility("private")}
          style={[
            styles.chip,
            visibility === "private" && {
              backgroundColor: theme.colors.primaryContainer,
            },
          ]}
        >
          Private
        </Chip>
      </View>

      <Chip
        selected={isDeadTime}
        onPress={() => setIsDeadTime(!isDeadTime)}
        style={[
          styles.deadTimeChip,
          isDeadTime && {
            backgroundColor: theme.colors.errorContainer,
          },
        ]}
      >
        Mark as Dead Time
      </Chip>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleCreateEvent}
          style={styles.button}
        >
          Create Event
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.button}
        >
          Cancel
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
  title: {
    marginBottom: 24,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeInput: {
    flex: 0.48,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
  },
  visibilityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  deadTimeChip: {
    marginBottom: 24,
  },
  actions: {
    marginTop: 16,
  },
  button: {
    marginBottom: 12,
  },
});

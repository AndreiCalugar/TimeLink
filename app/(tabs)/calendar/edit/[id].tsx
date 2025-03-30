import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import {
  TextInput,
  Button,
  Text,
  Chip,
  useTheme,
  IconButton,
  Portal,
  Dialog,
  Divider,
} from "react-native-paper";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import {
  useCalendarContext,
  EventVisibility,
} from "../../../../context/CalendarContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, parse } from "date-fns";
import EventAttendees from "../../../../components/calendar/EventAttendees";

export default function EditEventScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const { getEventById, updateEvent, deleteEvent } = useCalendarContext();
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  // Fetch the event by ID
  const event = getEventById(id as string);

  // If event not found, go back to calendar
  useEffect(() => {
    if (!event) {
      router.back();
    }
  }, [event, router]);

  // If event is undefined, show loading or return early
  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Event not found</Text>
      </View>
    );
  }

  // Parse date and time strings into Date objects
  const parsedDate = parse(event.date, "yyyy-MM-dd", new Date());
  const parsedStartTime = event.startTime
    ? parse(event.startTime, "HH:mm", new Date())
    : new Date();
  const parsedEndTime = event.endTime
    ? parse(event.endTime, "HH:mm", new Date())
    : new Date(new Date().setHours(new Date().getHours() + 1));

  // Event state
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || "");
  const [date, setDate] = useState(parsedDate);
  const [startTime, setStartTime] = useState(parsedStartTime);
  const [endTime, setEndTime] = useState(parsedEndTime);
  const [location, setLocation] = useState(event.location || "");
  const [visibility, setVisibility] = useState<EventVisibility>(
    event.visibility
  );
  const [isDeadTime, setIsDeadTime] = useState(event.isDeadTime || false);
  const [attendees, setAttendees] = useState<string[]>(event.attendees || []);

  // State for showing/hiding date and time pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Handle form submission
  const handleUpdateEvent = async () => {
    // Validate form
    if (!title.trim()) {
      // Show error - title is required
      return;
    }

    await updateEvent(event.id, {
      title,
      description,
      date: format(date, "yyyy-MM-dd"),
      startTime: format(startTime, "HH:mm"),
      endTime: format(endTime, "HH:mm"),
      location,
      visibility,
      isDeadTime,
      attendees,
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

  // Handle delete with confirmation
  const showDeleteConfirmation = () => {
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirmed = async () => {
    setDeleteDialogVisible(false);
    await deleteEvent(event.id);
    router.back();
  };

  // Handle date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Handle start time change
  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setStartTime(selectedTime);

      // If end time is earlier than start time, update end time to be 1 hour after start time
      if (selectedTime > endTime) {
        const newEndTime = new Date(selectedTime);
        newEndTime.setHours(selectedTime.getHours() + 1);
        setEndTime(newEndTime);
      }
    }
  };

  // Handle end time change
  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Event",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: "#fff",
        }}
      />
      <ScrollView style={styles.container}>
        <Text style={[styles.title, { fontSize: 24, fontWeight: "bold" }]}>
          Edit Event
        </Text>

        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        {/* Date Picker */}
        <View style={styles.datePickerContainer}>
          <Text style={[styles.label, { fontWeight: "bold", fontSize: 16 }]}>
            Date:
          </Text>
          <View style={styles.datePickerButton}>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              {format(date, "EEEE, MMM d, yyyy")}
            </Button>
            <IconButton
              icon="calendar"
              size={24}
              onPress={() => setShowDatePicker(true)}
            />
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Time Pickers */}
        <View style={styles.timeContainer}>
          <View style={styles.timePickerContainer}>
            <Text style={[styles.label, { fontWeight: "bold", fontSize: 16 }]}>
              Start Time:
            </Text>
            <View style={styles.timePickerButton}>
              <Button
                mode="outlined"
                onPress={() => setShowStartTimePicker(true)}
                style={styles.timeButton}
              >
                {format(startTime, "h:mm a")}
              </Button>
              <IconButton
                icon="clock-outline"
                size={24}
                onPress={() => setShowStartTimePicker(true)}
              />
            </View>
            {showStartTimePicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleStartTimeChange}
              />
            )}
          </View>

          <View style={styles.timePickerContainer}>
            <Text style={[styles.label, { fontWeight: "bold", fontSize: 16 }]}>
              End Time:
            </Text>
            <View style={styles.timePickerButton}>
              <Button
                mode="outlined"
                onPress={() => setShowEndTimePicker(true)}
                style={styles.timeButton}
              >
                {format(endTime, "h:mm a")}
              </Button>
              <IconButton
                icon="clock-outline"
                size={24}
                onPress={() => setShowEndTimePicker(true)}
              />
            </View>
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleEndTimeChange}
              />
            )}
          </View>
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

        <Divider style={styles.divider} />

        <EventAttendees attendees={attendees} onChange={setAttendees} />

        <Divider style={styles.divider} />

        <Text
          style={[styles.sectionTitle, { fontWeight: "bold", fontSize: 16 }]}
        >
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

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleUpdateEvent}
            style={styles.updateButton}
          >
            Update Event
          </Button>

          <Button
            mode="outlined"
            onPress={showDeleteConfirmation}
            textColor={theme.colors.error}
            style={styles.deleteButton}
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
              Are you sure you want to delete this event? This action cannot be
              undone.
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
  label: {
    marginBottom: 8,
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateButton: {
    flex: 1,
  },
  timeContainer: {
    marginBottom: 16,
  },
  timePickerContainer: {
    marginBottom: 16,
  },
  timePickerButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeButton: {
    flex: 1,
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
  buttonContainer: {
    marginTop: 16,
  },
  updateButton: {
    marginBottom: 12,
  },
  deleteButton: {
    marginBottom: 12,
  },
  divider: {
    marginVertical: 16,
  },
});

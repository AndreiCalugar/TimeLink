import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import {
  TextInput,
  Button,
  Text,
  Chip,
  useTheme,
  IconButton,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  useCalendarContext,
  EventVisibility,
} from "../../../context/CalendarContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, parse } from "date-fns";

export default function CreateEventScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();
  const { createEvent } = useCalendarContext();

  // Get the date from params or use today
  const initialDate =
    (params.date as string) || new Date().toISOString().split("T")[0];

  // Convert initialDate string to Date object
  const parsedInitialDate = parse(initialDate, "yyyy-MM-dd", new Date());

  // Event state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(parsedInitialDate);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(
    new Date(new Date().setHours(new Date().getHours() + 1))
  );
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState<EventVisibility>("public");
  const [isDeadTime, setIsDeadTime] = useState(false);

  // State for showing/hiding date and time pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

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
      date: format(date, "yyyy-MM-dd"),
      startTime: format(startTime, "HH:mm"),
      endTime: format(endTime, "HH:mm"),
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

  // Simplified date picker for web platform
  const renderDatePicker = () => {
    if (Platform.OS === "web") {
      return (
        <input
          type="date"
          value={format(date, "yyyy-MM-dd")}
          onChange={(e) => {
            const newDate = e.target.value
              ? parse(e.target.value, "yyyy-MM-dd", new Date())
              : new Date();
            setDate(newDate);
          }}
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: theme.colors.outline,
            borderRadius: 4,
            marginTop: 8,
            width: "100%",
          }}
        />
      );
    }

    return (
      showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )
    );
  };

  // Simplified time picker for web platform
  const renderTimePicker = (
    timeValue: Date,
    onTimeChange: (event: any, date?: Date) => void,
    showPicker: boolean
  ) => {
    if (Platform.OS === "web") {
      return (
        <input
          type="time"
          value={format(timeValue, "HH:mm")}
          onChange={(e) => {
            if (e.target.value) {
              const [hours, minutes] = e.target.value.split(":").map(Number);
              const newTime = new Date(timeValue);
              newTime.setHours(hours, minutes);
              onTimeChange({}, newTime);
            }
          }}
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: theme.colors.outline,
            borderRadius: 4,
            marginTop: 8,
            width: "100%",
          }}
        />
      );
    }

    return (
      showPicker && (
        <DateTimePicker
          value={timeValue}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )
    );
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

      {/* Date Picker */}
      <View style={styles.datePickerContainer}>
        <Text variant="labelLarge" style={styles.label}>
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
        {renderDatePicker()}
      </View>

      {/* Time Pickers */}
      <View style={styles.timeContainer}>
        <View style={styles.timePickerContainer}>
          <Text variant="labelLarge" style={styles.label}>
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
          {renderTimePicker(
            startTime,
            handleStartTimeChange,
            showStartTimePicker
          )}
        </View>

        <View style={styles.timePickerContainer}>
          <Text variant="labelLarge" style={styles.label}>
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
          {renderTimePicker(endTime, handleEndTimeChange, showEndTimePicker)}
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
  actions: {
    marginTop: 16,
  },
  button: {
    marginBottom: 12,
  },
});

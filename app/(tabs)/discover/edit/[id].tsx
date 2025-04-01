import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  Alert,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  Chip,
  useTheme,
  IconButton,
  Divider,
  SegmentedButtons,
  Switch,
  HelperText,
  Card,
  Avatar,
  TouchableRipple,
  Portal,
  Dialog,
} from "react-native-paper";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import {
  useCalendarContext,
  EventVisibility,
} from "../../../../context/CalendarContext";
import {
  useDiscovery,
  DiscoveryEvent,
} from "../../../../context/DiscoveryContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  format,
  parse,
  addMonths,
  addWeeks,
  addDays,
  parseISO,
} from "date-fns";
import EventAttendees from "../../../../components/calendar/EventAttendees";
import LoadingScreen from "../../../../components/ui/LoadingScreen";
import EmptyState from "../../../../components/ui/EmptyState";

type RecurrenceType = "none" | "daily" | "weekly" | "monthly";

export default function EditEventScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const { updateEvent, getEventById, deleteEvent } = useCalendarContext();
  const { events } = useDiscovery();

  // Find the event in the discovery events
  const discoveryEvent = events.find((e) => e.id === id) as
    | DiscoveryEvent
    | undefined;
  const calendarEvent = discoveryEvent ? getEventById(id as string) : null;
  const event = discoveryEvent || calendarEvent;

  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  // Basic event details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(
    new Date(new Date().setHours(new Date().getHours() + 1))
  );
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");

  // Event settings
  const [visibility, setVisibility] = useState<EventVisibility>("public");
  const [isAllDay, setIsAllDay] = useState(false);
  const [isDeadTime, setIsDeadTime] = useState(false);
  const [attendees, setAttendees] = useState<string[]>([]);
  const [maxAttendees, setMaxAttendees] = useState("");

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [activeSection, setActiveSection] = useState("basic"); // basic, advanced

  // Category options
  const categories = [
    "sports",
    "music",
    "food",
    "art",
    "technology",
    "education",
    "networking",
    "games",
    "outdoors",
    "health",
  ];

  // Visibility options
  const visibilityOptions = [
    { value: "public", label: "Public", icon: "earth" },
    { value: "friends", label: "Friends", icon: "account-group" },
    { value: "private", label: "Private", icon: "lock" },
  ];

  // Load event data
  useEffect(() => {
    if (event) {
      // Set basic details
      setTitle(event.title);
      setDescription(event.description || "");
      setLocation(event.location || "");

      // Use type assertion for properties only in DiscoveryEvent
      if ("category" in event) {
        setCategory((event as DiscoveryEvent).category || "");
      }

      if ("image" in event) {
        setCoverImage((event as DiscoveryEvent).image || "");
      }

      // Parse dates
      try {
        const eventDate = parseISO(event.date);
        setDate(eventDate);

        if (event.startTime) {
          const [startHour, startMinute] = event.startTime
            .split(":")
            .map(Number);
          const newStartTime = new Date(eventDate);
          newStartTime.setHours(startHour, startMinute);
          setStartTime(newStartTime);
        }

        if (event.endTime) {
          const [endHour, endMinute] = event.endTime.split(":").map(Number);
          const newEndTime = new Date(eventDate);
          newEndTime.setHours(endHour, endMinute);
          setEndTime(newEndTime);
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }

      // Set other properties
      setVisibility(event.visibility);
      setIsAllDay(!event.startTime && !event.endTime);
      setIsDeadTime(event.isDeadTime || false);
      setAttendees(event.attendees || []);

      // Set additional properties for discovery events
      if (discoveryEvent) {
        setMaxAttendees(discoveryEvent.attendingCount?.toString() || "");
      }
    }

    setIsLoading(false);
  }, [event]);

  if (isLoading) {
    return <LoadingScreen message="Loading event details..." />;
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Event Not Found"
          message="The event you're trying to edit doesn't exist or has been removed."
          icon="calendar-remove"
          buttonText="Back to Discover"
          onButtonPress={() => router.back()}
        />
      </View>
    );
  }

  // Handle form submission
  const handleUpdateEvent = async () => {
    // Validate form
    if (!title.trim()) {
      Alert.alert("Error", "Event title is required");
      return;
    }

    if (!date) {
      Alert.alert("Error", "Event date is required");
      return;
    }

    // Create updated event object
    const updatedEvent = {
      title,
      description,
      date: format(date, "yyyy-MM-dd"),
      startTime: isAllDay ? undefined : format(startTime, "HH:mm"),
      endTime: isAllDay ? undefined : format(endTime, "HH:mm"),
      location,
      visibility,
      isDeadTime,
      attendees,
      category,
      image:
        coverImage ||
        `https://source.unsplash.com/random/300x200?${category || "event"}`,
      isAllDay,
    };

    try {
      setIsLoading(true);
      await updateEvent(event.id, updatedEvent);
      Alert.alert("Success", "Event updated successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show delete confirmation dialog
  const showDeleteConfirmation = () => {
    setDeleteDialogVisible(true);
  };

  // Handle delete event
  const handleDeleteConfirmed = async () => {
    try {
      setIsLoading(true);
      setDeleteDialogVisible(false);
      await deleteEvent(event.id);
      Alert.alert("Success", "Event deleted successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to delete event. Please try again.");
      setIsLoading(false);
    }
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
  const renderDatePicker = (
    dateValue: Date,
    onDateChange: (event: any, date?: Date) => void,
    showPicker: boolean
  ) => {
    if (Platform.OS === "web") {
      return (
        <input
          type="date"
          value={format(dateValue, "yyyy-MM-dd")}
          onChange={(e) => {
            const newDate = e.target.value
              ? parse(e.target.value, "yyyy-MM-dd", new Date())
              : new Date();
            onDateChange({}, newDate);
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
          value={dateValue}
          mode="date"
          display="default"
          onChange={onDateChange}
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

  // Function to add a cover image
  const handleAddCoverImage = () => {
    // In a real app, you would have image picking and uploading functionality
    // For this demo, we'll use a random placeholder image
    setCoverImage(
      `https://source.unsplash.com/random/800x600?${category || "event"}`
    );
  };

  // Function to remove cover image
  const handleRemoveCoverImage = () => {
    setCoverImage("");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Event",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: theme.colors.primary },
        }}
      />

      <ScrollView style={styles.container}>
        {/* Cover Image */}
        <View style={styles.coverImageContainer}>
          {coverImage ? (
            <View>
              <Image
                source={{ uri: coverImage }}
                style={styles.coverImage}
                resizeMode="cover"
              />
              <View style={styles.coverImageOverlay}>
                <Button
                  icon="image-edit"
                  mode="contained"
                  onPress={handleAddCoverImage}
                  style={styles.coverImageButton}
                >
                  Change
                </Button>
                <Button
                  icon="delete"
                  mode="contained"
                  onPress={handleRemoveCoverImage}
                  buttonColor={theme.colors.error}
                  style={styles.coverImageButton}
                >
                  Remove
                </Button>
              </View>
            </View>
          ) : (
            <TouchableRipple
              onPress={handleAddCoverImage}
              style={styles.addCoverButton}
            >
              <View style={styles.addCoverContent}>
                <MaterialCommunityIcons
                  name="image-plus"
                  size={48}
                  color={theme.colors.primary}
                />
                <Text style={styles.addCoverText}>Add Cover Image</Text>
              </View>
            </TouchableRipple>
          )}
        </View>

        {/* Section Tabs */}
        <View style={styles.tabsContainer}>
          <SegmentedButtons
            value={activeSection}
            onValueChange={setActiveSection}
            buttons={[
              { value: "basic", label: "Basic" },
              { value: "advanced", label: "Advanced" },
            ]}
          />
        </View>

        {/* Basic Details Section */}
        {activeSection === "basic" && (
          <View style={styles.section}>
            <TextInput
              label="Event Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              mode="outlined"
            />

            <View style={styles.row}>
              <TouchableRipple
                onPress={() => setShowDatePicker(true)}
                style={styles.dateTimeButton}
              >
                <View style={styles.dateTimeField}>
                  <Text style={styles.dateTimeLabel}>Date</Text>
                  <View style={styles.dateTimeValueContainer}>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={18}
                      color={theme.colors.primary}
                      style={styles.dateTimeIcon}
                    />
                    <Text style={styles.dateTimeValue}>
                      {format(date, "EEEE, MMMM d, yyyy")}
                    </Text>
                  </View>
                </View>
              </TouchableRipple>
              {renderDatePicker(date, handleDateChange, showDatePicker)}
            </View>

            <View style={styles.switchRow}>
              <Text>All Day Event</Text>
              <Switch value={isAllDay} onValueChange={setIsAllDay} />
            </View>

            {!isAllDay && (
              <View style={styles.timeRow}>
                <View style={styles.timeField}>
                  <TouchableRipple
                    onPress={() => setShowStartTimePicker(true)}
                    style={styles.timeButton}
                  >
                    <View style={styles.timeValueContainer}>
                      <Text style={styles.timeLabel}>Start Time</Text>
                      <View style={styles.timeValueRow}>
                        <MaterialCommunityIcons
                          name="clock-start"
                          size={18}
                          color={theme.colors.primary}
                          style={styles.timeIcon}
                        />
                        <Text style={styles.timeValue}>
                          {format(startTime, "h:mm a")}
                        </Text>
                      </View>
                    </View>
                  </TouchableRipple>
                  {renderTimePicker(
                    startTime,
                    handleStartTimeChange,
                    showStartTimePicker
                  )}
                </View>

                <View style={styles.timeField}>
                  <TouchableRipple
                    onPress={() => setShowEndTimePicker(true)}
                    style={styles.timeButton}
                  >
                    <View style={styles.timeValueContainer}>
                      <Text style={styles.timeLabel}>End Time</Text>
                      <View style={styles.timeValueRow}>
                        <MaterialCommunityIcons
                          name="clock-end"
                          size={18}
                          color={theme.colors.primary}
                          style={styles.timeIcon}
                        />
                        <Text style={styles.timeValue}>
                          {format(endTime, "h:mm a")}
                        </Text>
                      </View>
                    </View>
                  </TouchableRipple>
                  {renderTimePicker(
                    endTime,
                    handleEndTimeChange,
                    showEndTimePicker
                  )}
                </View>
              </View>
            )}

            <TextInput
              label="Location"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="map-marker" />}
            />

            <Text style={styles.sectionLabel}>Category</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  selected={category === cat}
                  onPress={() => setCategory(cat)}
                  style={styles.categoryChip}
                  showSelectedOverlay
                >
                  {cat}
                </Chip>
              ))}
            </View>

            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
          </View>
        )}

        {/* Advanced Section */}
        {activeSection === "advanced" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Settings</Text>

            <Text style={styles.sectionLabel}>Visibility</Text>
            <SegmentedButtons
              value={visibility}
              onValueChange={(value) => setVisibility(value as EventVisibility)}
              buttons={visibilityOptions.map((option) => ({
                value: option.value,
                label: option.label,
                icon: option.icon,
              }))}
              style={styles.segmentedButtons}
            />

            <TextInput
              label="Maximum Attendees (Optional)"
              value={maxAttendees}
              onChangeText={(text) => {
                // Only allow numbers
                if (/^\d*$/.test(text)) {
                  setMaxAttendees(text);
                }
              }}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="account-group" />}
            />

            <View style={styles.switchRow}>
              <View>
                <Text>Mark as Busy Time</Text>
                <Text style={styles.switchSubtext}>
                  Show this time as unavailable in your calendar
                </Text>
              </View>
              <Switch value={isDeadTime} onValueChange={setIsDeadTime} />
            </View>

            <Divider style={styles.divider} />

            <Text style={styles.sectionTitle}>Manage Attendees</Text>
            <EventAttendees attendees={attendees} onChange={setAttendees} />
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <Button
            mode="contained"
            onPress={handleUpdateEvent}
            style={styles.updateButton}
            icon="content-save"
            loading={isLoading}
            disabled={isLoading}
          >
            Save Changes
          </Button>

          <Button
            mode="outlined"
            onPress={showDeleteConfirmation}
            style={styles.deleteButton}
            icon="delete"
            textColor={theme.colors.error}
            disabled={isLoading}
          >
            Delete Event
          </Button>
        </View>
      </ScrollView>

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Event</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to delete "{title}"? This action cannot be
              undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              onPress={handleDeleteConfirmed}
              textColor={theme.colors.error}
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
  coverImageContainer: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  coverImage: {
    width: "100%",
    height: 200,
  },
  coverImageOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    padding: 8,
  },
  coverImageButton: {
    marginLeft: 8,
  },
  addCoverButton: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
  addCoverContent: {
    alignItems: "center",
  },
  addCoverText: {
    marginTop: 8,
    fontSize: 16,
  },
  tabsContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  section: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  row: {
    marginBottom: 16,
  },
  dateTimeButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
  },
  dateTimeField: {},
  dateTimeLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  dateTimeValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateTimeIcon: {
    marginRight: 8,
  },
  dateTimeValue: {
    fontSize: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchSubtext: {
    fontSize: 12,
    color: "#666",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  timeField: {
    width: "48%",
  },
  timeButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
  },
  timeValueContainer: {},
  timeLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  timeValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeIcon: {
    marginRight: 8,
  },
  timeValue: {
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  categoryChip: {
    margin: 4,
  },
  divider: {
    marginVertical: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  buttonsContainer: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 16,
    marginBottom: 32,
  },
  updateButton: {
    marginBottom: 16,
  },
  deleteButton: {
    borderColor: "red",
  },
});

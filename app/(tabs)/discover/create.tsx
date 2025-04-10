import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  Alert,
  SafeAreaView,
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
  Title,
} from "react-native-paper";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import {
  useCalendarContext,
  EventVisibility,
} from "../../../context/CalendarContext";
import { useDiscovery } from "../../../context/DiscoveryContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, parse, addMonths, addWeeks, addDays } from "date-fns";
import EventAttendees from "../../../components/calendar/EventAttendees";
import AppHeader from "../../../components/ui/AppHeader";
import { useToast } from "../../../context/ToastContext";

type RecurrenceType = "none" | "daily" | "weekly" | "monthly";

export default function CreateEventScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();
  const { createEvent } = useCalendarContext();
  const { showToast } = useToast();

  // Get the date from params or use today
  const initialDate =
    (params.date as string) || new Date().toISOString().split("T")[0];

  // Convert initialDate string to Date object
  const parsedInitialDate = parse(initialDate, "yyyy-MM-dd", new Date());

  // Basic event details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(parsedInitialDate);
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

  // Recurrence options
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(
    addMonths(new Date(), 1)
  );

  // RSVP options
  const [allowRsvp, setAllowRsvp] = useState(true);
  const [rsvpDeadline, setRsvpDeadline] = useState<Date | null>(null);
  const [allowMaybeRsvp, setAllowMaybeRsvp] = useState(true);

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showRecurrenceEndDatePicker, setShowRecurrenceEndDatePicker] =
    useState(false);
  const [showRsvpDeadlinePicker, setShowRsvpDeadlinePicker] = useState(false);
  const [activeSection, setActiveSection] = useState("basic"); // basic, advanced, recurrence, rsvp

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

  // Handle form submission
  const handleCreateEvent = async () => {
    // Validate form
    if (!title.trim()) {
      showToast({
        message: "Event title is required",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (!date) {
      showToast({
        message: "Event date is required",
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Create base event
    const baseEvent = {
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
      color: isDeadTime
        ? "#EA4335"
        : visibility === "public"
        ? "#4285F4"
        : visibility === "friends"
        ? "#34A853"
        : "#FBBC05",
      // Add additional event properties
      isAllDay,
      maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
      allowRsvp,
      rsvpDeadline: rsvpDeadline
        ? format(rsvpDeadline, "yyyy-MM-dd")
        : undefined,
      allowMaybeRsvp,
    };

    // Handle recurring events
    if (isRecurring && recurrenceType !== "none" && recurrenceEndDate) {
      // In a real app, we would create a series of events or handle recurrence in the backend
      // For this demo, we'll just show a toast notification
      showToast({
        message: `This event will recur ${recurrenceType} until ${format(
          recurrenceEndDate,
          "MMMM d, yyyy"
        )}`,
        type: "info",
        duration: 4000,
      });
    }

    try {
      await createEvent(baseEvent);
      showToast({
        message: "Event created successfully",
        type: "success",
        duration: 3000,
      });
      router.back();
    } catch (error) {
      showToast({
        message: "Failed to create event. Please try again.",
        type: "error",
        duration: 4000,
      });
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

  // Handle recurrence end date change
  const handleRecurrenceEndDateChange = (event: any, selectedDate?: Date) => {
    setShowRecurrenceEndDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setRecurrenceEndDate(selectedDate);
    }
  };

  // Handle RSVP deadline change
  const handleRsvpDeadlineChange = (event: any, selectedDate?: Date) => {
    setShowRsvpDeadlinePicker(Platform.OS === "ios");
    if (selectedDate) {
      setRsvpDeadline(selectedDate);
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
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Create Event"
        showBackButton={true}
        rightActionIcon="check"
        onRightActionPress={handleCreateEvent}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
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
              { value: "recurrence", label: "Recurrence" },
              { value: "rsvp", label: "RSVP" },
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

            <Text style={styles.sectionTitle}>Invite Friends</Text>
            <EventAttendees attendees={attendees} onChange={setAttendees} />
          </View>
        )}

        {/* Recurrence Section */}
        {activeSection === "recurrence" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recurrence Settings</Text>

            <View style={styles.switchRow}>
              <Text>Recurring Event</Text>
              <Switch value={isRecurring} onValueChange={setIsRecurring} />
            </View>

            {isRecurring && (
              <>
                <Text style={styles.sectionLabel}>Repeat</Text>
                <SegmentedButtons
                  value={recurrenceType}
                  onValueChange={(value) =>
                    setRecurrenceType(value as RecurrenceType)
                  }
                  buttons={[
                    { value: "daily", label: "Daily" },
                    { value: "weekly", label: "Weekly" },
                    { value: "monthly", label: "Monthly" },
                  ]}
                  style={styles.segmentedButtons}
                />

                <View style={styles.row}>
                  <TouchableRipple
                    onPress={() => setShowRecurrenceEndDatePicker(true)}
                    style={styles.dateTimeButton}
                  >
                    <View style={styles.dateTimeField}>
                      <Text style={styles.dateTimeLabel}>Ends On</Text>
                      <View style={styles.dateTimeValueContainer}>
                        <MaterialCommunityIcons
                          name="calendar-end"
                          size={18}
                          color={theme.colors.primary}
                          style={styles.dateTimeIcon}
                        />
                        <Text style={styles.dateTimeValue}>
                          {recurrenceEndDate
                            ? format(recurrenceEndDate, "MMMM d, yyyy")
                            : "No end date"}
                        </Text>
                      </View>
                    </View>
                  </TouchableRipple>
                  {recurrenceEndDate &&
                    renderDatePicker(
                      recurrenceEndDate,
                      handleRecurrenceEndDateChange,
                      showRecurrenceEndDatePicker
                    )}
                </View>

                <Card style={styles.infoCard}>
                  <Card.Content>
                    <Text variant="bodyMedium">
                      This event will repeat{" "}
                      {recurrenceType === "daily"
                        ? "every day"
                        : recurrenceType === "weekly"
                        ? "every week"
                        : "every month"}
                      {recurrenceEndDate
                        ? ` until ${format(recurrenceEndDate, "MMMM d, yyyy")}`
                        : " indefinitely"}
                      .
                    </Text>
                  </Card.Content>
                </Card>
              </>
            )}
          </View>
        )}

        {/* RSVP Section */}
        {activeSection === "rsvp" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RSVP Settings</Text>

            <View style={styles.switchRow}>
              <Text>Enable RSVP</Text>
              <Switch value={allowRsvp} onValueChange={setAllowRsvp} />
            </View>

            {allowRsvp && (
              <>
                <View style={styles.row}>
                  <TouchableRipple
                    onPress={() => setShowRsvpDeadlinePicker(true)}
                    style={styles.dateTimeButton}
                  >
                    <View style={styles.dateTimeField}>
                      <Text style={styles.dateTimeLabel}>
                        RSVP Deadline (Optional)
                      </Text>
                      <View style={styles.dateTimeValueContainer}>
                        <MaterialCommunityIcons
                          name="calendar-clock"
                          size={18}
                          color={theme.colors.primary}
                          style={styles.dateTimeIcon}
                        />
                        <Text style={styles.dateTimeValue}>
                          {rsvpDeadline
                            ? format(rsvpDeadline, "MMMM d, yyyy")
                            : "No deadline"}
                        </Text>
                      </View>
                    </View>
                  </TouchableRipple>
                  {rsvpDeadline &&
                    renderDatePicker(
                      rsvpDeadline,
                      handleRsvpDeadlineChange,
                      showRsvpDeadlinePicker
                    )}
                </View>

                <View style={styles.switchRow}>
                  <Text>Allow "Maybe" Responses</Text>
                  <Switch
                    value={allowMaybeRsvp}
                    onValueChange={setAllowMaybeRsvp}
                  />
                </View>

                <Card style={styles.rsvpPreviewCard}>
                  <Card.Title title="RSVP Options Preview" />
                  <Card.Content>
                    <View style={styles.rsvpPreviewButtons}>
                      <Button
                        mode="contained"
                        icon="check-circle"
                        style={[
                          styles.rsvpButton,
                          { backgroundColor: theme.colors.primary },
                        ]}
                      >
                        Going
                      </Button>

                      {allowMaybeRsvp && (
                        <Button
                          mode="contained"
                          icon="help-circle"
                          style={[
                            styles.rsvpButton,
                            { backgroundColor: theme.colors.secondary },
                          ]}
                        >
                          Maybe
                        </Button>
                      )}

                      <Button
                        mode="contained"
                        icon="close-circle"
                        style={[
                          styles.rsvpButton,
                          { backgroundColor: theme.colors.error },
                        ]}
                      >
                        Not Going
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              </>
            )}
          </View>
        )}

        {/* Submit Button */}
        <View style={styles.submitButtonContainer}>
          <Button
            mode="contained"
            onPress={handleCreateEvent}
            style={styles.submitButton}
            icon="calendar-plus"
          >
            Create Event
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  infoCard: {
    marginTop: 16,
    backgroundColor: "#f0f7ff",
  },
  rsvpPreviewCard: {
    marginTop: 16,
  },
  rsvpPreviewButtons: {
    flexDirection: "column",
  },
  rsvpButton: {
    marginBottom: 8,
  },
  submitButtonContainer: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 16,
    marginBottom: 32,
  },
  submitButton: {
    paddingVertical: 8,
  },
  scrollContent: {
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
});

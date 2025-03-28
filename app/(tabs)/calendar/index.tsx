import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useTheme, FAB } from "react-native-paper";
import { useCalendarContext } from "../../../context/CalendarContext";
import { useRouter } from "expo-router";

// Define type for event visibility
type EventVisibility = "public" | "private" | "friends";

// Define interface for event data
interface CalendarEvent {
  id: string;
  title: string;
  date: string; // format: 'YYYY-MM-DD'
  startTime?: string;
  endTime?: string;
  visibility: EventVisibility;
  color?: string;
  isDeadTime?: boolean;
  location?: string;
}

// Interface for the marked dates object
interface MarkedDates {
  [date: string]: {
    dots?: Array<{ key: string; color: string }>;
    selected?: boolean;
    selectedColor?: string;
  };
}

// Define valid routes for type safety
const Routes = {
  eventDetails: (id: string) => `/event/${id}` as const,
  createEvent: "/create" as const,
};

export default function CalendarScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { events, getEventsByDate } = useCalendarContext();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Prepare the marked dates for the calendar
  const getMarkedDates = (): MarkedDates => {
    const markedDates: MarkedDates = {};

    // Mark dates with events
    Object.keys(events).forEach((date) => {
      // Create dots for each event type
      const dots = events[date].map((event) => ({
        key: event.id,
        color: event.color || theme.colors.primary,
      }));

      markedDates[date] = {
        dots,
        selected: date === selectedDate,
        selectedColor: theme.colors.primaryContainer,
      };
    });

    // Mark selected date if not already marked
    if (!markedDates[selectedDate]) {
      markedDates[selectedDate] = {
        selected: true,
        selectedColor: theme.colors.primaryContainer,
      };
    }

    return markedDates;
  };

  // Handle date selection
  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  // Handle navigation to event details
  const handleEventPress = (eventId: string) => {
    // Here we're working around the type system by using any
    // This is not ideal but works for now
    router.push(Routes.eventDetails(eventId) as any);
  };

  // Handle navigation to create event
  const handleCreateEvent = () => {
    // Here we're working around the type system by using any
    router.push({
      pathname: Routes.createEvent as any,
      params: { date: selectedDate },
    });
  };

  // Get events for the selected date
  const selectedDateEvents = getEventsByDate(selectedDate);

  return (
    <View style={styles.container}>
      <Calendar
        theme={{
          backgroundColor: theme.colors.background,
          calendarBackground: theme.colors.background,
          textSectionTitleColor: theme.colors.primary,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: theme.colors.onPrimary,
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.onBackground,
          textDisabledColor: theme.colors.outline,
          dotColor: theme.colors.primary,
          selectedDotColor: theme.colors.onPrimary,
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.onBackground,
          indicatorColor: theme.colors.primary,
        }}
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
        markingType={"multi-dot"}
      />

      <View style={styles.eventsContainer}>
        <Text style={[styles.dateTitle, { color: theme.colors.onBackground }]}>
          Events for {selectedDate}
        </Text>

        {selectedDateEvents.length > 0 ? (
          selectedDateEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[
                styles.eventCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderLeftColor: event.color || theme.colors.primary,
                },
                event.isDeadTime && styles.deadTimeCard,
              ]}
              onPress={() => handleEventPress(event.id)}
            >
              <View style={styles.eventHeader}>
                <Text
                  style={[styles.eventTitle, { color: theme.colors.onSurface }]}
                >
                  {event.title}
                </Text>
                <Text
                  style={[
                    styles.eventVisibility,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {event.visibility}
                </Text>
              </View>
              {(event.startTime || event.endTime) && (
                <Text
                  style={[
                    styles.eventTime,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {event.startTime} - {event.endTime}
                </Text>
              )}
              {event.location && (
                <Text
                  style={[
                    styles.eventLocation,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {event.location}
                </Text>
              )}
              {event.isDeadTime && (
                <Text
                  style={[styles.deadTimeLabel, { color: theme.colors.error }]}
                >
                  Dead Time
                </Text>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <Text
            style={[styles.noEvents, { color: theme.colors.onSurfaceVariant }]}
          >
            No events scheduled for this day
          </Text>
        )}
      </View>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={handleCreateEvent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  eventsContainer: {
    flex: 1,
    padding: 16,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  eventCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deadTimeCard: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#EA4335",
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  eventVisibility: {
    fontSize: 12,
    textTransform: "capitalize",
  },
  eventTime: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  deadTimeLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  noEvents: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

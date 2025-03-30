import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useTheme, FAB, SegmentedButtons } from "react-native-paper";
import { useCalendarContext } from "../../../context/CalendarContext";
import { useRouter } from "expo-router";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
} from "date-fns";
import EventCard from "@/components/calendar/EventCard";
import DateNavigator from "@/components/calendar/DateNavigator";
import AgendaView from "@/components/calendar/AgendaView";

// Define type for calendar view
type CalendarViewType = "day" | "week" | "month" | "agenda";

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
  eventDetails: (id: string) => `/calendar/event/${id}` as const,
  createEvent: "/calendar/create" as const,
};

export default function CalendarScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { events, getEventsByDate } = useCalendarContext();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewType, setViewType] = useState<CalendarViewType>("month");

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

  // Get week days for week view
  const getWeekDays = () => {
    const selectedDateObj = new Date(selectedDate);
    const start = startOfWeek(selectedDateObj, { weekStartsOn: 0 });
    const end = endOfWeek(selectedDateObj, { weekStartsOn: 0 });

    return eachDayOfInterval({ start, end });
  };

  // Render day view
  const renderDayView = () => {
    const formattedDate = format(new Date(selectedDate), "EEEE, MMMM d, yyyy");

    return (
      <View style={styles.dayViewContainer}>
        <DateNavigator
          date={selectedDate}
          viewType="day"
          onDateChange={setSelectedDate}
        />

        {selectedDateEvents.length > 0 ? (
          selectedDateEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={handleEventPress}
            />
          ))
        ) : (
          <Text
            style={[styles.noEvents, { color: theme.colors.onSurfaceVariant }]}
          >
            No events scheduled for this day
          </Text>
        )}
      </View>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const weekDays = getWeekDays();

    return (
      <View style={styles.weekViewContainer}>
        <DateNavigator
          date={selectedDate}
          viewType="week"
          onDateChange={setSelectedDate}
        />

        <ScrollView>
          {weekDays.map((day) => {
            const dateString = format(day, "yyyy-MM-dd");
            const dayEvents = getEventsByDate(dateString);
            const isSelected = dateString === selectedDate;
            const dayName = format(day, "EEE");
            const dayNumber = format(day, "d");

            return (
              <View key={dateString} style={styles.weekDayContainer}>
                <TouchableOpacity
                  style={[
                    styles.weekDayHeader,
                    isSelected && {
                      backgroundColor: theme.colors.primaryContainer,
                    },
                  ]}
                  onPress={() => setSelectedDate(dateString)}
                >
                  <Text style={styles.weekDayName}>{dayName}</Text>
                  <Text style={styles.weekDayNumber}>{dayNumber}</Text>
                </TouchableOpacity>

                <View style={styles.weekDayEvents}>
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onPress={handleEventPress}
                        compact={true}
                      />
                    ))
                  ) : (
                    <Text
                      style={[
                        styles.noEventsSmall,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      No events
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // Render month view (existing calendar)
  const renderMonthView = () => {
    return (
      <>
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
          <Text
            style={[styles.dateTitle, { color: theme.colors.onBackground }]}
          >
            Events for {format(new Date(selectedDate), "MMMM d, yyyy")}
          </Text>

          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={handleEventPress}
              />
            ))
          ) : (
            <Text
              style={[
                styles.noEvents,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              No events scheduled for this day
            </Text>
          )}
        </View>
      </>
    );
  };

  // Add renderAgendaView function
  const renderAgendaView = () => {
    return (
      <View style={styles.agendaViewContainer}>
        <AgendaView
          events={events}
          onEventPress={handleEventPress}
          numberOfDays={30} // Show events for the next 30 days
        />
      </View>
    );
  };

  // Update renderCalendarView function to include agenda view
  const renderCalendarView = () => {
    switch (viewType) {
      case "day":
        return renderDayView();
      case "week":
        return renderWeekView();
      case "agenda":
        return renderAgendaView();
      case "month":
      default:
        return renderMonthView();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewSwitcherContainer}>
        <SegmentedButtons
          value={viewType}
          onValueChange={(value) => setViewType(value as CalendarViewType)}
          buttons={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "agenda", label: "Agenda" },
          ]}
          style={styles.viewSwitcher}
        />
      </View>

      {renderCalendarView()}

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
  viewSwitcherContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  viewSwitcher: {
    marginBottom: 8,
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
  noEvents: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 16,
  },
  noEventsSmall: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  // Day view styles
  dayViewContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  // Week view styles
  weekViewContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  weekDayContainer: {
    marginBottom: 16,
  },
  weekDayHeader: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    alignItems: "center",
  },
  weekDayName: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
  weekDayNumber: {
    fontSize: 16,
  },
  weekDayEvents: {
    marginTop: 8,
  },
  // Add agendaViewContainer style
  agendaViewContainer: {
    flex: 1,
  },
});

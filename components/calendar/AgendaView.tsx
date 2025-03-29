import React from "react";
import { StyleSheet, View, ScrollView, SectionList } from "react-native";
import { Text, Divider, useTheme } from "react-native-paper";
import { format, isToday, isTomorrow, addDays, isSameDay } from "date-fns";
import EventCard from "./EventCard";
import { CalendarEvent } from "@/context/CalendarContext";

interface AgendaViewProps {
  events: Record<string, CalendarEvent[]>;
  onEventPress: (eventId: string) => void;
  numberOfDays?: number;
}

type AgendaSectionData = {
  title: string;
  data: CalendarEvent[];
  date: Date;
};

export default function AgendaView({
  events,
  onEventPress,
  numberOfDays = 14, // Default to showing events for the next 2 weeks
}: AgendaViewProps) {
  const theme = useTheme();

  // Process events for section list
  const getSections = (): AgendaSectionData[] => {
    const sections: AgendaSectionData[] = [];
    const today = new Date();

    // Create sections for the next N days
    for (let i = 0; i < numberOfDays; i++) {
      const date = addDays(today, i);
      const dateString = format(date, "yyyy-MM-dd");
      const eventsForDay = events[dateString] || [];

      // Get appropriate title for the section
      let title: string;
      if (isToday(date)) {
        title = "Today";
      } else if (isTomorrow(date)) {
        title = "Tomorrow";
      } else {
        title = format(date, "EEEE, MMMM d"); // e.g. "Monday, January 15"
      }

      // Only add sections with events
      if (eventsForDay.length > 0) {
        sections.push({
          title,
          data: eventsForDay.sort((a, b) => {
            // Sort events by start time (if available)
            if (a.startTime && b.startTime) {
              return a.startTime.localeCompare(b.startTime);
            }
            return 0;
          }),
          date,
        });
      }
    }

    return sections;
  };

  const sections = getSections();

  // Render the empty state if no events
  if (sections.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text
          style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
        >
          No upcoming events in the next {numberOfDays} days
        </Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <EventCard event={item} onPress={onEventPress} compact={false} />
      )}
      renderSectionHeader={({ section: { title, date } }) => (
        <View
          style={[
            styles.sectionHeader,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: isToday(date)
                  ? theme.colors.primary
                  : theme.colors.onSurface,
              },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.sectionDate,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {format(date, "MMMM d, yyyy")}
          </Text>
          <Divider style={styles.divider} />
        </View>
      )}
      contentContainerStyle={styles.listContent}
      stickySectionHeadersEnabled={true}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100, // Add padding for FAB
  },
  sectionHeader: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionDate: {
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});

import React from "react";
import { StyleSheet, View, ScrollView, SectionList } from "react-native";
import { Text, Divider, useTheme, Surface } from "react-native-paper";
import {
  format,
  isToday,
  isTomorrow,
  addDays,
  isSameDay,
  isPast,
  isFuture,
  subDays,
} from "date-fns";
import EventCard from "./EventCard";
import { CalendarEvent } from "@/context/CalendarContext";

interface AgendaViewProps {
  events: Record<string, CalendarEvent[]>;
  onEventPress: (eventId: string) => void;
  numberOfDays?: number;
  pastDaysToShow?: number;
}

type AgendaSectionData = {
  title: string;
  data: CalendarEvent[];
  date: Date;
  isPastSection: boolean;
  isCurrentSection: boolean;
  isFutureSection: boolean;
};

export default function AgendaView({
  events,
  onEventPress,
  numberOfDays = 30, // Default to showing events for the next 30 days
  pastDaysToShow = 14, // Default to showing events from the past 14 days
}: AgendaViewProps) {
  const theme = useTheme();

  // Process events for section list
  const getSections = (): AgendaSectionData[] => {
    const sections: AgendaSectionData[] = [];
    const today = new Date();

    // Add past days
    for (let i = pastDaysToShow; i > 0; i--) {
      const date = subDays(today, i);
      const dateString = format(date, "yyyy-MM-dd");
      const eventsForDay = events[dateString] || [];

      if (eventsForDay.length > 0) {
        sections.push({
          title: format(date, "EEEE, MMMM d"),
          data: eventsForDay.sort((a, b) => {
            if (a.startTime && b.startTime) {
              return a.startTime.localeCompare(b.startTime);
            }
            return 0;
          }),
          date,
          isPastSection: true,
          isCurrentSection: false,
          isFutureSection: false,
        });
      }
    }

    // Add today and future days
    for (let i = 0; i < numberOfDays; i++) {
      const date = addDays(today, i);
      const dateString = format(date, "yyyy-MM-dd");
      const eventsForDay = events[dateString] || [];

      // Get appropriate title for the section
      let title: string;
      let isCurrentSection = false;

      if (isToday(date)) {
        title = "Today";
        isCurrentSection = true;
      } else if (isTomorrow(date)) {
        title = "Tomorrow";
        isCurrentSection = true;
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
          isPastSection: false,
          isCurrentSection: isCurrentSection,
          isFutureSection: !isCurrentSection && !isPast(date),
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
          No events found in the selected time range
        </Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item, section }) => {
        const isPastEvent = (section as AgendaSectionData).isPastSection;
        const isCurrentEvent = (section as AgendaSectionData).isCurrentSection;
        const isFutureEvent = (section as AgendaSectionData).isFutureSection;

        return (
          <Surface
            style={[
              styles.eventContainer,
              isPastEvent && styles.pastEventContainer,
              isCurrentEvent && styles.currentEventContainer,
              isFutureEvent && styles.futureEventContainer,
              {
                backgroundColor: isPastEvent
                  ? theme.colors.surfaceVariant
                  : isCurrentEvent
                  ? theme.colors.surface
                  : theme.colors.surfaceVariant,
                elevation: isCurrentEvent ? 3 : 1,
              },
            ]}
          >
            <EventCard event={item} onPress={onEventPress} compact={false} />
            {isPastEvent && <View style={styles.pastEventOverlay} />}
          </Surface>
        );
      }}
      renderSectionHeader={({
        section: {
          title,
          date,
          isPastSection,
          isCurrentSection,
          isFutureSection,
        },
      }) => (
        <View
          style={[
            styles.sectionHeader,
            isPastSection && styles.pastSectionHeader,
            isCurrentSection && styles.currentSectionHeader,
            isFutureSection && styles.futureSectionHeader,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              isPastSection && styles.pastSectionTitle,
              isCurrentSection && {
                color: theme.colors.primary,
                fontWeight: "bold",
              },
              isFutureSection && { color: theme.colors.tertiary },
              !isCurrentSection &&
                !isPastSection &&
                !isFutureSection && { color: theme.colors.onSurface },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.sectionDate,
              isPastSection && { color: theme.colors.outline },
              !isPastSection && { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {format(date, "MMMM d, yyyy")}
          </Text>
          <Divider style={styles.divider} />
        </View>
      )}
      contentContainerStyle={styles.listContent}
      stickySectionHeadersEnabled={true}
      initialNumToRender={20}
      maxToRenderPerBatch={15}
      windowSize={10}
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
  pastSectionHeader: {
    opacity: 0.7,
  },
  currentSectionHeader: {
    paddingTop: 20,
    paddingBottom: 12,
  },
  futureSectionHeader: {
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  pastSectionTitle: {
    fontWeight: "normal",
    opacity: 0.7,
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
  eventContainer: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  pastEventContainer: {
    opacity: 0.7,
  },
  currentEventContainer: {
    marginVertical: 10,
    borderWidth: 0,
  },
  futureEventContainer: {
    borderLeftWidth: 3,
    borderLeftColor: "#3498db",
  },
  pastEventOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});

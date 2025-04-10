import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import {
  Appbar,
  Text,
  Avatar,
  Button,
  Card,
  Chip,
  List,
  Divider,
  useTheme,
} from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import { useFriends } from "../../../../context/FriendsContext";
import { useCalendarContext } from "../../../../context/CalendarContext";
import { useDiscovery } from "../../../../context/DiscoveryContext";
import LoadingScreen from "../../../../components/ui/LoadingScreen";
import EmptyState from "../../../../components/ui/EmptyState";
import MutualEvents from "../../../../components/friends/MutualEvents";
import AppHeader from "../../../../components/ui/AppHeader";
import ProfileHeader from "../../../../components/profile/ProfileHeader";
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";
import EventCard from "@/components/calendar/EventCard";
import DateNavigator from "@/components/calendar/DateNavigator";

// Define type for calendar view
type FriendProfileTab = "about" | "calendar" | "events";

// Define extended properties for friend profile
interface FriendProfileData {
  bio?: string;
  location?: string;
}

export default function FriendDetailScreen() {
  const theme = useTheme();
  const { friendId } = useLocalSearchParams<{ friendId: string }>();
  const { getFriendById, removeFriend, isLoading } = useFriends();
  const { events: calendarEvents, getEventsByDate } = useCalendarContext();
  const { getMutualEvents } = useDiscovery();

  // Active tab state
  const [activeTab, setActiveTab] = useState<FriendProfileTab>("about");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Get the friend's details
  const friend = getFriendById(friendId || "");

  // Get friend's events - both from discovery and from calendar events where they're attendees
  const discoveryEvents = friend ? getMutualEvents(friend.id) : [];

  // Get all calendar events where the friend is an attendee
  const getAllFriendEvents = () => {
    if (!friend) return [];

    // Get events from calendar where friend is an attendee
    const attendeeEvents = [];

    // Loop through all dates in the calendar
    for (const date in calendarEvents) {
      // Filter events for each date where friend is an attendee
      const friendEventsOnDate = calendarEvents[date].filter((event) =>
        event.attendees?.includes(friend.name)
      );

      // Add these events to our list
      attendeeEvents.push(...friendEventsOnDate);
    }

    // Combine with discovery events and remove duplicates
    const allEvents = [...discoveryEvents, ...attendeeEvents];

    // Remove duplicates based on event ID
    const uniqueEvents = Array.from(
      new Map(allEvents.map((event) => [event.id, event])).values()
    );

    return uniqueEvents;
  };

  // Store all friend events
  const friendEvents = getAllFriendEvents();

  // Handle unfriend action
  const handleUnfriend = async () => {
    if (friend) {
      const success = await removeFriend(friend.id);
      if (success) {
        router.back();
      }
    }
  };

  // View all mutual events
  const viewAllMutualEvents = () => {
    router.push({
      pathname: "/(tabs)/friends/mutual-events/[friendId]",
      params: { friendId: friend?.id || "" },
    });
  };

  // Create event with friend
  const createEventWithFriend = () => {
    if (!friend) return;

    // Format the friend's data as an attendee
    const friendAttendee = friend.name;

    router.push({
      pathname: "/calendar/create",
      params: {
        friendId: friend.id,
        // Pass initial attendee as a URL param
        initialAttendees: friendAttendee,
      },
    });
  };

  // Handle date selection in calendar
  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  // Prepare the marked dates for the calendar - using friend's events
  const getMarkedDates = () => {
    const markedDates: any = {};

    // Group friend events by date
    const eventsByDate: Record<string, typeof friendEvents> = {};

    friendEvents.forEach((event) => {
      if (!eventsByDate[event.date]) {
        eventsByDate[event.date] = [];
      }
      eventsByDate[event.date].push(event);
    });

    // Mark dates with events
    Object.keys(eventsByDate).forEach((date) => {
      // Create dots for each event
      const dots = eventsByDate[date].map((event) => ({
        key: event.id,
        color: event.color || theme.colors.primary,
      }));

      if (dots.length > 0) {
        markedDates[date] = {
          dots,
          selected: date === selectedDate,
          selectedColor: theme.colors.primaryContainer,
        };
      }
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

  // Get friend's events for the selected date
  const getFriendEventsForDate = (date: string) => {
    return friendEvents.filter((event) => event.date === date);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading friend details..." />;
  }

  if (!friend) {
    return (
      <View style={styles.container}>
        <AppHeader
          title="Friend Details"
          showBackButton={true}
          backDestination="/(tabs)/friends"
        />
        <EmptyState
          icon="account-question"
          title="Friend Not Found"
          message="We couldn't find this friend in your list."
          buttonText="Go Back"
          onButtonPress={() => router.push("/(tabs)/friends")}
        />
      </View>
    );
  }

  // Generate placeholder data for friend profile
  const friendBio = "TimeLink user and event enthusiast"; // Placeholder bio if none exists
  const friendLocation = "New York, NY"; // Placeholder location if none exists

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <AppHeader
        title={`${friend.name}'s Profile`}
        showBackButton={true}
        backDestination="/(tabs)/friends"
      />

      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <ProfileHeader
          name={friend.name}
          bio={friendBio}
          profilePicture={friend.profilePicture}
          location={friendLocation}
          joinDate={friend.since || ""}
        />

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <Button
            mode={activeTab === "about" ? "contained" : "outlined"}
            onPress={() => setActiveTab("about")}
            style={styles.tabButton}
          >
            About
          </Button>
          <Button
            mode={activeTab === "calendar" ? "contained" : "outlined"}
            onPress={() => setActiveTab("calendar")}
            style={styles.tabButton}
          >
            Calendar
          </Button>
          <Button
            mode={activeTab === "events" ? "contained" : "outlined"}
            onPress={() => setActiveTab("events")}
            style={styles.tabButton}
          >
            Events
          </Button>
        </View>

        <Divider style={styles.divider} />

        {/* Tab Content */}
        {activeTab === "about" && (
          <View style={styles.sectionContainer}>
            <Card style={styles.card}>
              <Card.Title title="About" />
              <Card.Content>
                <Text>{friendBio}</Text>

                {friend.interests && friend.interests.length > 0 && (
                  <View style={styles.interestsContainer}>
                    <Text style={styles.sectionTitle}>Interests</Text>
                    <View style={styles.interestsList}>
                      {friend.interests.map((interest, index) => (
                        <View key={index} style={styles.interestItem}>
                          <Text>{interest}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.statsContainer}>
                  <Text style={styles.sectionTitle}>Stats</Text>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Mutual Friends:</Text>
                    <Text style={styles.statValue}>
                      {friend.mutualFriends || 0}
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Mutual Events:</Text>
                    <Text style={styles.statValue}>
                      {friend.mutualEvents || 0}
                    </Text>
                  </View>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button icon="account-multiple" onPress={viewAllMutualEvents}>
                  View Mutual Events
                </Button>
              </Card.Actions>
            </Card>
          </View>
        )}

        {activeTab === "calendar" && (
          <View style={styles.sectionContainer}>
            <Card style={styles.card}>
              <Card.Title title={`${friend.name}'s Calendar`} />
              <Card.Content>
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

                <Divider style={styles.divider} />

                <DateNavigator
                  date={selectedDate}
                  viewType="day"
                  onDateChange={setSelectedDate}
                />

                <Text style={styles.dateHeading}>
                  {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
                </Text>

                {getFriendEventsForDate(selectedDate).length > 0 ? (
                  getFriendEventsForDate(selectedDate).map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onPress={(eventId) =>
                        router.push(`/calendar/event/${eventId}`)
                      }
                    />
                  ))
                ) : (
                  <Text style={styles.noEvents}>
                    No events scheduled for this day
                  </Text>
                )}
              </Card.Content>
              <Card.Actions>
                <Button icon="calendar-plus" onPress={createEventWithFriend}>
                  Create Event with {friend.name.split(" ")[0]}
                </Button>
              </Card.Actions>
            </Card>
          </View>
        )}

        {activeTab === "events" && (
          <View style={styles.sectionContainer}>
            <Card style={styles.card}>
              <Card.Title title={`Mutual Events with ${friend.name}`} />
              <Card.Content>
                <MutualEvents
                  friendId={friend.id}
                  maxEvents={10}
                  showViewAll={true}
                />
              </Card.Content>
            </Card>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  mutualStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  statCount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  statDivider: {
    height: 24,
    width: 1,
    backgroundColor: "#ddd",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  divider: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionContainer: {
    marginBottom: 16,
    padding: 8,
  },
  card: {
    marginBottom: 16,
  },
  interestsContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
  },
  interestsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  interestItem: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  statsContainer: {
    marginTop: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  statValue: {
    fontWeight: "bold",
  },
  dateHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
  },
  noEvents: {
    textAlign: "center",
    marginVertical: 24,
    opacity: 0.6,
  },
});

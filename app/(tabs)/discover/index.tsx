import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from "react-native";
import {
  Text,
  Chip,
  Searchbar,
  Button,
  Divider,
  SegmentedButtons,
  FAB,
} from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import { useDiscovery } from "../../../context/DiscoveryContext";
import DiscoveryEventCard from "../../../components/discovery/DiscoveryEventCard";
import FilterModal, {
  FilterOptions,
} from "../../../components/discovery/FilterModal";
import { CalendarEvent } from "../../../context/CalendarContext";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingScreen from "../../../components/ui/LoadingScreen";
import AppHeader from "../../../components/ui/AppHeader";
import { SafeAreaView } from "react-native-safe-area-context";

// Define valid routes for type safety
const Routes = {
  eventDetails: (id: string) => `/(tabs)/discover/event/${id}` as const,
  createEvent: "/(tabs)/discover/create" as const,
  editEvent: (id: string) => `/(tabs)/discover/edit/${id}` as const,
};

export default function DiscoveryScreen() {
  const { events, isLoading, refreshEvents } = useDiscovery();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({
    categories: [],
    dateRange: "all",
    attendees: "any",
    sortBy: "relevance",
  });

  // Filtered events based on search and category filters
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);

  // Track the last refresh time to prevent too frequent refreshes
  const lastRefreshTime = useRef<number>(0);

  // Refresh events when the screen comes into focus, but limit frequency
  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        const now = Date.now();
        // Only refresh if it's been more than 10 seconds since the last refresh
        if (now - lastRefreshTime.current > 10000) {
          setRefreshing(true);
          await refreshEvents();
          setRefreshing(false);
          lastRefreshTime.current = now;
        }
      };

      refreshData();

      return () => {
        // Cleanup function if needed
      };
    }, [refreshEvents])
  );

  // Categories for quick filter
  const timeFilters = [
    { value: "all", label: "All" },
    { value: "today", label: "Today" },
    { value: "weekend", label: "This Weekend" },
  ];

  useEffect(() => {
    // Apply filtering logic
    let result = [...events];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.description &&
            event.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply time filter
    if (selectedFilter === "today") {
      const today = new Date().toISOString().split("T")[0];
      result = result.filter((event) => event.date === today);
    } else if (selectedFilter === "weekend") {
      // Get next weekend dates
      const now = new Date();
      const dayOfWeek = now.getDay();
      const daysUntilSaturday = dayOfWeek === 6 ? 0 : 6 - dayOfWeek;
      const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

      const saturday = new Date(now);
      saturday.setDate(now.getDate() + daysUntilSaturday);
      const sunday = new Date(now);
      sunday.setDate(now.getDate() + daysUntilSunday);

      const saturdayStr = saturday.toISOString().split("T")[0];
      const sundayStr = sunday.toISOString().split("T")[0];

      result = result.filter(
        (event) => event.date === saturdayStr || event.date === sundayStr
      );
    }

    // Apply category filters
    if (appliedFilters.categories.length > 0) {
      result = result.filter(
        (event) =>
          event.category && appliedFilters.categories.includes(event.category)
      );
    }

    // Apply date range filter from modal
    if (appliedFilters.dateRange !== "all") {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const todayStr = today.toISOString().split("T")[0];
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      if (appliedFilters.dateRange === "today") {
        result = result.filter((event) => event.date === todayStr);
      } else if (appliedFilters.dateRange === "tomorrow") {
        result = result.filter((event) => event.date === tomorrowStr);
      } else if (appliedFilters.dateRange === "this-week") {
        // Calculate dates for this week
        const startOfWeek = new Date(today);
        const daysSinceMonday = (today.getDay() + 6) % 7; // Adjust if week starts on Monday
        startOfWeek.setDate(today.getDate() - daysSinceMonday);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        result = result.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= startOfWeek && eventDate <= endOfWeek;
        });
      } else if (appliedFilters.dateRange === "this-month") {
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        result = result.filter((event) => {
          const eventDate = new Date(event.date);
          return (
            eventDate.getMonth() === currentMonth &&
            eventDate.getFullYear() === currentYear
          );
        });
      }
    }

    // Apply attendees filter
    if (appliedFilters.attendees !== "any") {
      if (appliedFilters.attendees === "friends") {
        result = result.filter(
          (event) => event.friendsAttending && event.friendsAttending.length > 0
        );
      } else if (appliedFilters.attendees === "large") {
        result = result.filter((event) => (event.attendingCount || 0) >= 20);
      } else if (appliedFilters.attendees === "small") {
        result = result.filter(
          (event) =>
            (event.attendingCount || 0) > 0 && (event.attendingCount || 0) < 20
        );
      }
    }

    // Apply sorting
    if (appliedFilters.sortBy === "date") {
      result.sort((a, b) => a.date.localeCompare(b.date));
    } else if (appliedFilters.sortBy === "popularity") {
      result.sort((a, b) => (b.attendingCount || 0) - (a.attendingCount || 0));
    }
    // Note: relevance and distance would need more complex implementations

    setFilteredEvents(result);
  }, [events, searchQuery, selectedFilter, appliedFilters]);

  const onRefresh = async () => {
    const now = Date.now();
    // Only allow manual refresh if it's been more than 10 seconds since the last refresh
    if (now - lastRefreshTime.current > 10000) {
      setRefreshing(true);
      await refreshEvents();
      setRefreshing(false);
      lastRefreshTime.current = now;
    } else {
      // Simulate a refresh without actually calling the API
      setRefreshing(true);
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleEventPress = (eventId: string) => {
    router.push(Routes.eventDetails(eventId) as any);
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setAppliedFilters(filters);
    setFilterModalVisible(false);
  };

  const renderEventCard = ({ item }: { item: CalendarEvent }) => (
    <DiscoveryEventCard
      event={item}
      onPress={() => handleEventPress(item.id)}
    />
  );

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <AppHeader
        title="Discover"
        rightActionIcon="plus"
        onRightActionPress={() => router.push(Routes.createEvent as any)}
      />

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search events"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <Button
          mode="contained"
          onPress={() => setFilterModalVisible(true)}
          style={styles.filterButton}
        >
          Filters
        </Button>
      </View>

      {/* Quick time filter */}
      <View style={styles.chipContainer}>
        <SegmentedButtons
          value={selectedFilter}
          onValueChange={setSelectedFilter}
          buttons={timeFilters}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Applied Filters Indicator */}
      {appliedFilters.categories.length > 0 && (
        <View style={styles.appliedFiltersContainer}>
          <Text style={styles.appliedFiltersText}>
            Filters applied: {appliedFilters.categories.join(", ")}
          </Text>
        </View>
      )}

      {isLoading && !refreshing ? (
        <LoadingScreen message="Loading events..." />
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.eventsList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={() => renderSectionHeader("Events Near You")}
          ListEmptyComponent={() => (
            <EmptyState
              title="No events found"
              message="Try changing your filters or search terms"
              icon="calendar-blank"
            />
          )}
        />
      )}

      {/* Create Event FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push(Routes.createEvent as any)}
        label="Create Event"
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onDismiss={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        initialFilters={appliedFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#f0f0f0",
  },
  filterButton: {
    minWidth: 90,
  },
  chipContainer: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  segmentedButtons: {
    flex: 1,
  },
  appliedFiltersContainer: {
    backgroundColor: "#e3f2fd",
    padding: 8,
    paddingHorizontal: 16,
  },
  appliedFiltersText: {
    fontSize: 14,
    color: "#1976d2",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  eventsList: {
    padding: 16,
    paddingBottom: 32,
  },
  separator: {
    height: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import {
  Modal,
  Portal,
  Text,
  Button,
  Chip,
  Divider,
  RadioButton,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface FilterOptions {
  categories: string[];
  dateRange: string;
  attendees: string;
  sortBy: string;
}

interface FilterModalProps {
  visible: boolean;
  onDismiss: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export default function FilterModal({
  visible,
  onDismiss,
  onApply,
  initialFilters,
}: FilterModalProps) {
  const theme = useTheme();

  // Default filter options
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters?.categories || []
  );
  const [dateRange, setDateRange] = useState<string>(
    initialFilters?.dateRange || "all"
  );
  const [attendees, setAttendees] = useState<string>(
    initialFilters?.attendees || "any"
  );
  const [sortBy, setSortBy] = useState<string>(
    initialFilters?.sortBy || "relevance"
  );

  // Available categories
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

  // Toggle a category in the selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Reset all filters to default
  const resetFilters = () => {
    setSelectedCategories([]);
    setDateRange("all");
    setAttendees("any");
    setSortBy("relevance");
  };

  // Handle apply button click
  const handleApply = () => {
    const filters: FilterOptions = {
      categories: selectedCategories,
      dateRange,
      attendees,
      sortBy,
    };
    onApply(filters);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text variant="titleLarge">Filter Events</Text>
          <Button mode="text" onPress={resetFilters} style={styles.resetButton}>
            Reset
          </Button>
        </View>

        <Divider />

        <ScrollView style={styles.content}>
          {/* Categories Section */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Categories
            </Text>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  selected={selectedCategories.includes(category)}
                  onPress={() => toggleCategory(category)}
                  style={[
                    styles.categoryChip,
                    selectedCategories.includes(category) && {
                      backgroundColor: theme.colors.primaryContainer,
                    },
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Chip>
              ))}
            </View>
          </View>

          <Divider />

          {/* Date Range Section */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Date Range
            </Text>
            <RadioButton.Group onValueChange={setDateRange} value={dateRange}>
              <RadioButton.Item label="Today" value="today" />
              <RadioButton.Item label="Tomorrow" value="tomorrow" />
              <RadioButton.Item label="This Week" value="this-week" />
              <RadioButton.Item label="This Month" value="this-month" />
              <RadioButton.Item label="Any Time" value="all" />
            </RadioButton.Group>
          </View>

          <Divider />

          {/* Attendees Section */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Attendees
            </Text>
            <RadioButton.Group onValueChange={setAttendees} value={attendees}>
              <RadioButton.Item label="Any" value="any" />
              <RadioButton.Item
                label="Events with friends attending"
                value="friends"
              />
              <RadioButton.Item
                label="Large events (20+ attendees)"
                value="large"
              />
              <RadioButton.Item
                label="Small events (< 20 attendees)"
                value="small"
              />
            </RadioButton.Group>
          </View>

          <Divider />

          {/* Sort By Section */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Sort By
            </Text>
            <RadioButton.Group onValueChange={setSortBy} value={sortBy}>
              <RadioButton.Item label="Relevance" value="relevance" />
              <RadioButton.Item label="Date (Soonest)" value="date" />
              <RadioButton.Item label="Popularity" value="popularity" />
              <RadioButton.Item label="Distance (Closest)" value="distance" />
            </RadioButton.Group>
          </View>
        </ScrollView>

        <Divider />

        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={styles.footerButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleApply}
            style={styles.footerButton}
          >
            Apply Filters
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 8,
    overflow: "hidden",
    maxHeight: "80%",
    width: "90%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  resetButton: {
    marginLeft: 8,
  },
  content: {
    flexGrow: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  categoryChip: {
    margin: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 24 : 16, // Extra padding for iOS
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

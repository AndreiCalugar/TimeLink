import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Chip,
  Button,
  TextInput,
  Card,
  Divider,
  useTheme,
  IconButton,
  Snackbar,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useProfile } from "../../../context/ProfileContext";
import { Interest } from "../../../types/profile";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppHeader from "../../../components/ui/AppHeader";

// A set of predefined interests to show in the UI
const PREDEFINED_INTERESTS: Interest[] = [
  { id: "int-travel", name: "Travel", category: "Lifestyle", icon: "airplane" },
  { id: "int-cooking", name: "Cooking", category: "Food", icon: "food" },
  { id: "int-music", name: "Music", category: "Arts", icon: "music" },
  {
    id: "int-movies",
    name: "Movies",
    category: "Entertainment",
    icon: "movie",
  },
  {
    id: "int-sports",
    name: "Sports",
    category: "Activities",
    icon: "basketball",
  },
  {
    id: "int-gaming",
    name: "Gaming",
    category: "Entertainment",
    icon: "gamepad-variant",
  },
  { id: "int-art", name: "Art", category: "Arts", icon: "palette" },
  {
    id: "int-photography",
    name: "Photography",
    category: "Arts",
    icon: "camera",
  },
  {
    id: "int-technology",
    name: "Technology",
    category: "Technology",
    icon: "laptop",
  },
  { id: "int-nature", name: "Nature", category: "Outdoors", icon: "tree" },
  {
    id: "int-fitness",
    name: "Fitness",
    category: "Health",
    icon: "weight-lifter",
  },
  {
    id: "int-reading",
    name: "Reading",
    category: "Hobbies",
    icon: "book-open-variant",
  },
];

export default function InterestsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { interests, userInterests, addInterest, removeInterest } =
    useProfile();

  // State for the new custom interest
  const [customInterestName, setCustomInterestName] = useState("");
  const [customInterestIcon, setCustomInterestIcon] = useState("tag");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  // All available interests (predefined + existing from context)
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);

  // Current selected interests
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(
    new Set()
  );

  // Keep track of changes made
  const [hasChanges, setHasChanges] = useState(false);

  // Load interests from context when component mounts
  useEffect(() => {
    // Combine predefined interests with those from context
    const combined = [...PREDEFINED_INTERESTS];

    // Add interests from context that aren't already in the predefined list
    interests.forEach((interest) => {
      if (!combined.some((i) => i.id === interest.id)) {
        combined.push(interest);
      }
    });

    setAvailableInterests(combined);

    // Set up selected interests based on user's current interests
    const selected = new Set<string>();
    userInterests.forEach((userInterest) => {
      selected.add(userInterest.interestId);
    });

    setSelectedInterests(selected);
  }, [interests, userInterests]);

  // Filter interests based on search query
  const filteredInterests = availableInterests.filter(
    (interest) =>
      interest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interest.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      !searchQuery
  );

  // Toggle interest selection
  const toggleInterest = (interest: Interest) => {
    setSelectedInterests((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(interest.id)) {
        newSelected.delete(interest.id);
      } else {
        newSelected.add(interest.id);
      }
      return newSelected;
    });
    setHasChanges(true);
  };

  // Add custom interest
  const handleAddCustomInterest = () => {
    if (!customInterestName.trim()) return;

    const newInterest: Interest = {
      id: `custom-${Date.now()}`,
      name: customInterestName.trim(),
      category: "Custom",
      icon: customInterestIcon,
    };

    setAvailableInterests((prev) => [...prev, newInterest]);

    // Automatically select the new interest
    setSelectedInterests((prev) => {
      const newSelected = new Set(prev);
      newSelected.add(newInterest.id);
      return newSelected;
    });

    // Clear fields
    setCustomInterestName("");
    setCustomInterestIcon("tag");
    setHasChanges(true);
  };

  // Save changes
  const saveChanges = () => {
    // Get the current user interests IDs
    const currentInterestIds = new Set(
      userInterests.map((ui) => ui.interestId)
    );

    // Add new interests
    for (const interestId of selectedInterests) {
      if (!currentInterestIds.has(interestId)) {
        addInterest(interestId);
      }
    }

    // Remove interests that were deselected
    for (const interestId of currentInterestIds) {
      if (!selectedInterests.has(interestId)) {
        removeInterest(interestId);
      }
    }

    // Show success message
    setShowSnackbar(true);
    setHasChanges(false);

    // Navigate back to profile after a short delay
    setTimeout(() => {
      router.push("/(tabs)/profile");
    }, 1500); // Wait for 1.5 seconds to show the snackbar before navigating
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Manage Interests"
        showBackButton={true}
        backDestination="/(tabs)/profile"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionDescription}>
              Select interests to personalize your profile and discover events
              you'll love.
            </Text>

            <TextInput
              label="Search interests"
              value={searchQuery}
              onChangeText={setSearchQuery}
              mode="outlined"
              style={styles.searchInput}
              left={<TextInput.Icon icon="magnify" />}
              right={
                searchQuery ? (
                  <TextInput.Icon
                    icon="close"
                    onPress={() => setSearchQuery("")}
                  />
                ) : undefined
              }
            />

            <Divider style={styles.divider} />

            <Text style={styles.subheading}>Your Interests</Text>

            <View style={styles.interestsContainer}>
              {filteredInterests.map((interest) => (
                <Chip
                  key={interest.id}
                  selected={selectedInterests.has(interest.id)}
                  onPress={() => toggleInterest(interest)}
                  style={styles.interestChip}
                  showSelectedOverlay
                  icon={(props) => (
                    <MaterialCommunityIcons
                      name={(interest.icon as any) || "tag"}
                      size={16}
                      color={
                        selectedInterests.has(interest.id)
                          ? theme.colors.primary
                          : theme.colors.onSurfaceVariant
                      }
                    />
                  )}
                >
                  {interest.name}
                </Chip>
              ))}

              {filteredInterests.length === 0 && (
                <Text style={styles.noResultsText}>
                  No matching interests found. Add a custom interest below.
                </Text>
              )}
            </View>

            <Divider style={styles.divider} />

            <Text style={styles.subheading}>Add Custom Interest</Text>

            <View style={styles.inputRow}>
              <TextInput
                label="Interest Name"
                value={customInterestName}
                onChangeText={setCustomInterestName}
                mode="outlined"
                style={styles.input}
              />
              <IconButton
                icon="plus-circle"
                size={32}
                mode="contained"
                onPress={handleAddCustomInterest}
                disabled={!customInterestName.trim()}
                style={styles.addIconButton}
              />
            </View>

            <View style={styles.iconSelectorContainer}>
              <Text style={styles.iconSelectorLabel}>Choose an icon:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.iconScroller}
              >
                {[
                  "tag",
                  "heart",
                  "star",
                  "music",
                  "food",
                  "basketball",
                  "movie",
                  "book-open-variant",
                  "palette",
                  "gamepad-variant",
                  "laptop",
                  "airplane",
                ].map((icon) => (
                  <IconButton
                    key={icon}
                    icon={icon}
                    size={24}
                    selected={customInterestIcon === icon}
                    onPress={() => setCustomInterestIcon(icon)}
                    style={[
                      styles.iconButton,
                      customInterestIcon === icon && styles.selectedIconButton,
                    ]}
                    iconColor={
                      customInterestIcon === icon
                        ? theme.colors.primary
                        : theme.colors.onSurfaceVariant
                    }
                  />
                ))}
              </ScrollView>
            </View>

            <Button
              mode="contained"
              onPress={saveChanges}
              style={styles.saveButton}
              disabled={!hasChanges}
            >
              Save Changes
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        action={{
          label: "Dismiss",
          onPress: () => setShowSnackbar(false),
        }}
      >
        Interests updated successfully!
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionDescription: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
  searchInput: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  interestChip: {
    margin: 4,
  },
  noResultsText: {
    fontStyle: "italic",
    opacity: 0.6,
    marginVertical: 16,
    textAlign: "center",
    width: "100%",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  addIconButton: {
    marginTop: 8,
  },
  iconSelectorContainer: {
    marginBottom: 16,
  },
  iconSelectorLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  iconScroller: {
    flexDirection: "row",
    marginBottom: 8,
  },
  iconButton: {
    margin: 2,
  },
  selectedIconButton: {
    backgroundColor: "#E3F2FD",
  },
  saveButton: {
    marginTop: 16,
  },
});

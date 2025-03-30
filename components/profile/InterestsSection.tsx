import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Button, Chip, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Interest } from "../../types/profile";

interface InterestWithDetails {
  interestId: string;
  level?: "casual" | "enthusiast" | "expert";
  private?: boolean;
  interest?: Interest;
}

interface InterestsSectionProps {
  interests: InterestWithDetails[];
  onEdit: () => void;
}

const InterestsSection: React.FC<InterestsSectionProps> = ({
  interests,
  onEdit,
}) => {
  const theme = useTheme();

  const getLevelColor = (level: string | undefined) => {
    switch (level) {
      case "casual":
        return theme.colors.primary;
      case "enthusiast":
        return theme.colors.secondary;
      case "expert":
        return theme.colors.tertiary;
      default:
        return theme.colors.primary;
    }
  };

  const getLevelIcon = (level: string | undefined) => {
    switch (level) {
      case "casual":
        return "star-outline";
      case "enthusiast":
        return "star-half-full";
      case "expert":
        return "star";
      default:
        return "star-outline";
    }
  };

  // Convert the icon string to a valid Material Community Icons name
  const getIconName = (
    iconName: string | undefined
  ): keyof typeof MaterialCommunityIcons.glyphMap => {
    // If icon is undefined or not a valid name, return a default icon
    if (!iconName) {
      return "tag";
    }

    // Check if the icon exists in MaterialCommunityIcons
    return iconName in MaterialCommunityIcons.glyphMap
      ? (iconName as keyof typeof MaterialCommunityIcons.glyphMap)
      : "tag";
  };

  const renderInterestChip = (item: InterestWithDetails) => {
    if (!item.interest) return null;

    // Get a light background color based on level
    const getBackgroundColor = (level: string | undefined) => {
      switch (level) {
        case "casual":
          return "#E3F2FD"; // Light blue
        case "enthusiast":
          return "#E8F5E9"; // Light green
        case "expert":
          return "#FFF3E0"; // Light orange
        default:
          return "#E3F2FD"; // Light blue
      }
    };

    return (
      <Chip
        key={item.interestId}
        style={[
          styles.interestChip,
          { backgroundColor: getBackgroundColor(item.level) },
        ]}
        textStyle={{ color: getLevelColor(item.level) }}
        icon={() => (
          <MaterialCommunityIcons
            name={getIconName(item.interest?.icon)}
            size={16}
            color={getLevelColor(item.level)}
          />
        )}
      >
        {item.interest.name}
        {item.level && (
          <MaterialCommunityIcons
            name={
              getLevelIcon(
                item.level
              ) as keyof typeof MaterialCommunityIcons.glyphMap
            }
            size={14}
            color={getLevelColor(item.level)}
            style={styles.levelIcon}
          />
        )}
      </Chip>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title="Interests"
        right={(props) => (
          <Button mode="contained" compact onPress={onEdit} icon="pencil">
            Edit
          </Button>
        )}
      />
      <Card.Content>
        {interests.length > 0 ? (
          <View style={styles.interestsContainer}>
            {interests.map(renderInterestChip)}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="heart-off" size={36} color="#ccc" />
            <Text variant="bodyLarge" style={styles.emptyText}>
              No interests added yet
            </Text>
            <Button
              mode="outlined"
              onPress={onEdit}
              icon="plus"
              style={styles.addButton}
            >
              Add interests
            </Button>
          </View>
        )}

        <View style={styles.legendContainer}>
          <Text variant="bodySmall" style={styles.legendTitle}>
            Level:
          </Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <MaterialCommunityIcons
                name="star-outline"
                size={12}
                color={theme.colors.primary}
              />
              <Text variant="bodySmall" style={styles.legendText}>
                Casual
              </Text>
            </View>
            <View style={styles.legendItem}>
              <MaterialCommunityIcons
                name="star-half-full"
                size={12}
                color={theme.colors.secondary}
              />
              <Text variant="bodySmall" style={styles.legendText}>
                Enthusiast
              </Text>
            </View>
            <View style={styles.legendItem}>
              <MaterialCommunityIcons
                name="star"
                size={12}
                color={theme.colors.tertiary}
              />
              <Text variant="bodySmall" style={styles.legendText}>
                Expert
              </Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  interestChip: {
    margin: 4,
    height: 32,
  },
  levelIcon: {
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    color: "#888",
    marginVertical: 8,
  },
  addButton: {
    marginTop: 12,
  },
  legendContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  legendTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#666",
  },
  legendItems: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendText: {
    marginLeft: 4,
    color: "#666",
    fontSize: 10,
  },
});

export default InterestsSection;

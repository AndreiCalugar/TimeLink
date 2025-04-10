import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button, Chip, useTheme } from "react-native-paper";
import { UserInterest, Interest } from "../../types/profile";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type InterestsSectionProps = {
  interests: (UserInterest & { interest?: Interest })[];
  onEdit: () => void;
};

export default function InterestsSection({
  interests,
  onEdit,
}: InterestsSectionProps) {
  const theme = useTheme();

  // Render interests
  const renderInterests = () => {
    if (interests.length === 0) {
      return (
        <Text style={styles.emptyText}>
          No interests added yet. Add some to personalize your profile!
        </Text>
      );
    }

    return (
      <View style={styles.interestsContainer}>
        {interests.map((userInterest) => (
          <Chip
            key={userInterest.interestId}
            style={[
              styles.interestChip,
              {
                backgroundColor:
                  userInterest.level === "expert"
                    ? theme.colors.primaryContainer
                    : userInterest.level === "enthusiast"
                    ? theme.colors.secondaryContainer
                    : theme.colors.surfaceVariant,
              },
            ]}
            icon={({ size }) => (
              <MaterialCommunityIcons
                name={(userInterest.interest?.icon as any) || "tag"}
                size={size - 4}
                color={
                  userInterest.level === "expert"
                    ? theme.colors.primary
                    : userInterest.level === "enthusiast"
                    ? theme.colors.secondary
                    : theme.colors.onSurfaceVariant
                }
              />
            )}
          >
            {userInterest.interest?.name ||
              userInterest.interestId.replace(/^int-|^custom-/, "")}
          </Chip>
        ))}
      </View>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title="Interests"
        right={(props) => (
          <Button mode="text" onPress={onEdit}>
            Edit
          </Button>
        )}
      />
      <Card.Content>
        <Text style={styles.description}>
          Things I'm passionate about and love to do
        </Text>
        {renderInterests()}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  interestChip: {
    margin: 4,
  },
  emptyText: {
    fontStyle: "italic",
    opacity: 0.6,
    textAlign: "center",
    marginVertical: 16,
  },
});

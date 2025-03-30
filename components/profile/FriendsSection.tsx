import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Button, Avatar, List, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Friend } from "../../types/profile";

// Define type for icon names
type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface FriendsSectionProps {
  friends: Friend[];
  onAddFriend: () => void;
}

const FriendsSection: React.FC<FriendsSectionProps> = ({
  friends,
  onAddFriend,
}) => {
  // Get status icon and color
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return { icon: "check-circle" as IconName, color: "#4CAF50" };
      case "pending":
        return { icon: "clock-outline" as IconName, color: "#FFC107" };
      case "blocked":
        return { icon: "block-helper" as IconName, color: "#F44336" };
      default:
        return { icon: "account" as IconName, color: "#2196F3" };
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title="Friends"
        right={(props) => (
          <Button
            mode="contained"
            compact
            onPress={onAddFriend}
            icon="account-plus"
          >
            Add Friend
          </Button>
        )}
      />
      <Card.Content>
        {friends.length > 0 ? (
          <View>
            {friends.map((friend, index) => {
              const statusInfo = getStatusIcon(friend.status);
              return (
                <React.Fragment key={friend.id}>
                  {index > 0 && <Divider style={styles.divider} />}
                  <List.Item
                    title={friend.name}
                    description={
                      friend.since
                        ? `Friends since ${friend.since}`
                        : friend.status === "pending"
                        ? "Request pending"
                        : null
                    }
                    left={(props) =>
                      friend.profilePicture ? (
                        <Avatar.Image
                          size={48}
                          source={{ uri: friend.profilePicture }}
                          {...props}
                        />
                      ) : (
                        <Avatar.Text
                          size={48}
                          label={friend.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)}
                          {...props}
                        />
                      )
                    }
                    right={(props) => (
                      <MaterialCommunityIcons
                        name={statusInfo.icon}
                        size={24}
                        color={statusInfo.color}
                        style={styles.statusIcon}
                      />
                    )}
                  />
                </React.Fragment>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name={"account-group-outline" as IconName}
              size={48}
              color="#ccc"
            />
            <Text variant="bodyLarge" style={styles.emptyText}>
              No friends added yet
            </Text>
            <Button
              mode="outlined"
              onPress={onAddFriend}
              icon="account-plus"
              style={styles.addButton}
            >
              Add your first friend
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  divider: {
    marginVertical: 8,
  },
  statusIcon: {
    alignSelf: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    color: "#888",
    marginVertical: 12,
  },
  addButton: {
    marginTop: 12,
  },
});

export default FriendsSection;

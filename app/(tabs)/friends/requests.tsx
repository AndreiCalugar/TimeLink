import React, { useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import {
  Text,
  Card,
  Button,
  Avatar,
  Divider,
  IconButton,
  useTheme,
} from "react-native-paper";
import { router } from "expo-router";
import { useFriends } from "../../../context/FriendsContext";
import { FriendRequest } from "../../../context/FriendsContext";
import AppHeader from "../../../components/ui/AppHeader";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingScreen from "../../../components/ui/LoadingScreen";

export default function FriendRequestsScreen() {
  const theme = useTheme();
  const {
    friendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    isLoading,
  } = useFriends();
  const [pendingActions, setPendingActions] = useState<Record<string, string>>(
    {}
  );

  // Helper function to calculate time elapsed since request
  const getTimeElapsed = (dateString: string): string => {
    const requestDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - requestDate.getTime();

    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0)
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    if (diffHours > 0)
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    if (diffMins > 0)
      return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
    return "Just now";
  };

  const handleAccept = async (requestId: string) => {
    setPendingActions((prev) => ({ ...prev, [requestId]: "accepting" }));

    try {
      const success = await acceptFriendRequest(requestId);
      if (!success) {
        throw new Error("Failed to accept friend request");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setPendingActions((prev) => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });
    }
  };

  const handleDecline = async (requestId: string) => {
    setPendingActions((prev) => ({ ...prev, [requestId]: "declining" }));

    try {
      const success = await declineFriendRequest(requestId);
      if (!success) {
        throw new Error("Failed to decline friend request");
      }
    } catch (error) {
      console.error("Error declining friend request:", error);
    } finally {
      setPendingActions((prev) => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });
    }
  };

  const renderRequestItem = ({ item }: { item: FriendRequest }) => {
    const isPending = !!pendingActions[item.id];
    const actionType = pendingActions[item.id];

    return (
      <Card style={styles.requestCard}>
        <Card.Content style={styles.requestContent}>
          <View style={styles.userInfo}>
            {item.profilePicture ? (
              <Avatar.Image
                size={50}
                source={{ uri: item.profilePicture }}
                style={styles.avatar}
              />
            ) : (
              <Avatar.Text
                size={50}
                label={item.name.substring(0, 2).toUpperCase()}
                style={styles.avatar}
              />
            )}
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.requestTime}>
                {getTimeElapsed(item.requestDate)}
              </Text>
            </View>
          </View>
          <View style={styles.requestActions}>
            <Button
              mode="contained"
              onPress={() => handleAccept(item.id)}
              disabled={isPending}
              loading={actionType === "accepting"}
              style={[styles.actionButton, styles.acceptButton]}
              contentStyle={styles.buttonContent}
            >
              Accept
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleDecline(item.id)}
              disabled={isPending}
              loading={actionType === "declining"}
              style={styles.actionButton}
              contentStyle={styles.buttonContent}
            >
              Decline
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (isLoading) {
    return <LoadingScreen message="Loading requests..." />;
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Friend Requests"
        showBackButton={true}
        backDestination="/(tabs)/friends"
      />

      {friendRequests.length === 0 ? (
        <EmptyState
          title="No Friend Requests"
          message="When someone sends you a friend request, it will appear here."
          icon="account-multiple-outline"
        />
      ) : (
        <FlatList
          data={friendRequests.filter((req) => req.status === "pending")}
          keyExtractor={(item) => item.id}
          renderItem={renderRequestItem}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    padding: 16,
  },
  requestCard: {
    marginBottom: 8,
    elevation: 1,
  },
  requestContent: {
    padding: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
  },
  requestTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  requestActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    marginLeft: 8,
    borderRadius: 4,
  },
  acceptButton: {
    minWidth: 90,
  },
  buttonContent: {
    paddingHorizontal: 8,
    height: 36,
  },
  divider: {
    marginVertical: 8,
  },
});

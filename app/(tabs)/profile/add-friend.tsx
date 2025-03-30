import React, { useState } from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import {
  Text,
  Appbar,
  Searchbar,
  List,
  Avatar,
  Button,
  Divider,
} from "react-native-paper";
import { useProfile } from "../../../context/ProfileContext";
import { router } from "expo-router";

interface SuggestedUser {
  id: string;
  name: string;
  profilePicture?: string;
  bio?: string;
}

export default function AddFriendScreen() {
  const { friends, addFriend } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock suggested users data (in a real app, this would come from an API)
  const [suggestedUsers] = useState<SuggestedUser[]>([
    {
      id: "user5",
      name: "Emma Wilson",
      profilePicture: "https://randomuser.me/api/portraits/women/33.jpg",
      bio: "Travel enthusiast and photographer",
    },
    {
      id: "user6",
      name: "Alex Johnson",
      profilePicture: "https://randomuser.me/api/portraits/men/91.jpg",
      bio: "Software developer and hiking fan",
    },
    {
      id: "user7",
      name: "Olivia Smith",
      profilePicture: "https://randomuser.me/api/portraits/women/17.jpg",
      bio: "Food blogger and cooking instructor",
    },
    {
      id: "user8",
      name: "Noah Williams",
      profilePicture: "https://randomuser.me/api/portraits/men/22.jpg",
      bio: "Music producer and guitar player",
    },
  ]);

  // Filter suggested users based on search query
  const filteredUsers = suggestedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if a user is already a friend
  const isFriend = (userId: string) => {
    return friends.some((friend) => friend.id === userId);
  };

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Handle adding a friend
  const handleAddFriend = (user: SuggestedUser) => {
    addFriend(user.id, user.name, user.profilePicture);
  };

  const renderUserItem = ({ item }: { item: SuggestedUser }) => {
    const isAlreadyFriend = isFriend(item.id);

    return (
      <List.Item
        title={item.name}
        description={item.bio}
        left={(props) =>
          item.profilePicture ? (
            <Avatar.Image
              size={50}
              source={{ uri: item.profilePicture }}
              {...props}
            />
          ) : (
            <Avatar.Text size={50} label={getInitials(item.name)} {...props} />
          )
        }
        right={(props) => (
          <Button
            mode={isAlreadyFriend ? "outlined" : "contained"}
            onPress={() => !isAlreadyFriend && handleAddFriend(item)}
            disabled={isAlreadyFriend}
            style={styles.addButton}
          >
            {isAlreadyFriend ? "Added" : "Add"}
          </Button>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Add Friends" />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search for people..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No users found matching "{searchQuery}"
            </Text>
          </View>
        }
      />
    </View>
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
  },
  searchBar: {
    elevation: 0,
  },
  listContainer: {
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  addButton: {
    marginVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#888",
  },
});

import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text, Avatar } from "react-native-paper";

interface Friend {
  id: string;
  name: string;
  profilePicture?: string;
}

interface FriendsListProps {
  friends: Friend[];
  onFriendPress: (friend: Friend) => void;
}

export default function FriendsList({
  friends,
  onFriendPress,
}: FriendsListProps) {
  return (
    <View style={styles.container}>
      {friends.map((friend) => (
        <TouchableOpacity
          key={friend.id}
          onPress={() => onFriendPress(friend)}
          style={styles.friendItem}
        >
          {friend.profilePicture ? (
            <Image
              source={{ uri: friend.profilePicture }}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Text
              size={60}
              label={friend.name.substring(0, 2).toUpperCase()}
              style={styles.avatar}
            />
          )}
          <Text style={styles.name}>{friend.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  friendItem: {
    width: "33.33%",
    padding: 8,
    alignItems: "center",
  },
  avatar: {
    marginBottom: 4,
  },
  name: {
    fontSize: 12,
    textAlign: "center",
  },
});

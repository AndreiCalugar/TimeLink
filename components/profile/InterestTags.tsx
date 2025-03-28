import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip } from "react-native-paper";

interface Interest {
  id: string;
  name: string;
}

interface InterestTagsProps {
  interests: Interest[];
  onInterestPress: (interest: Interest) => void;
}

export default function InterestTags({
  interests,
  onInterestPress,
}: InterestTagsProps) {
  return (
    <View style={styles.container}>
      {interests.map((interest) => (
        <Chip
          key={interest.id}
          onPress={() => onInterestPress(interest)}
          style={styles.chip}
          mode="outlined"
        >
          {interest.name}
        </Chip>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  chip: {
    margin: 4,
  },
});

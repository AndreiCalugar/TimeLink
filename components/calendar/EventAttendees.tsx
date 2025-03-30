import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Chip,
  Avatar,
  Text,
  TextInput,
  Button,
  IconButton,
} from "react-native-paper";

interface EventAttendeesProps {
  attendees: string[];
  onChange?: (attendees: string[]) => void;
  readonly?: boolean;
}

export default function EventAttendees({
  attendees = [],
  onChange,
  readonly = false,
}: EventAttendeesProps) {
  const [newAttendee, setNewAttendee] = useState("");
  const [error, setError] = useState("");

  const handleAddAttendee = () => {
    // Validate email-like format
    if (!newAttendee.trim()) {
      setError("Please enter a name or email");
      return;
    }

    // Check if already exists
    if (attendees.includes(newAttendee.trim())) {
      setError("This person is already added");
      return;
    }

    // Add new attendee
    const updatedAttendees = [...attendees, newAttendee.trim()];
    onChange?.(updatedAttendees);

    // Reset state
    setNewAttendee("");
    setError("");
  };

  const handleRemoveAttendee = (attendee: string) => {
    const updatedAttendees = attendees.filter((a) => a !== attendee);
    onChange?.(updatedAttendees);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontWeight: "bold", fontSize: 16 }]}>
        Attendees
      </Text>

      {!readonly && (
        <View style={styles.addContainer}>
          <TextInput
            label="Add person"
            value={newAttendee}
            onChangeText={(text) => {
              setNewAttendee(text);
              setError("");
            }}
            style={styles.input}
            error={!!error}
            placeholder="Name or email"
            right={
              <TextInput.Icon
                icon="plus-circle-outline"
                onPress={handleAddAttendee}
              />
            }
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      )}

      <View style={styles.attendeesList}>
        {attendees.length === 0 ? (
          <Text style={styles.emptyText}>
            {readonly ? "No attendees" : "Add people to this event"}
          </Text>
        ) : (
          attendees.map((attendee, index) => (
            <Chip
              key={index}
              style={styles.attendeeChip}
              avatar={
                <Avatar.Text
                  size={24}
                  label={attendee.charAt(0).toUpperCase()}
                />
              }
              onClose={
                readonly ? undefined : () => handleRemoveAttendee(attendee)
              }
            >
              {attendee}
            </Chip>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  addContainer: {
    marginBottom: 12,
  },
  input: {
    marginBottom: 4,
  },
  errorText: {
    color: "#B00020",
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
  },
  attendeesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  attendeeChip: {
    margin: 4,
  },
  emptyText: {
    fontStyle: "italic",
    color: "#757575",
    marginVertical: 8,
  },
});

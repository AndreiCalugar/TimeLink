import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, IconButton, useTheme } from "react-native-paper";
import { format, addDays, addWeeks, subDays, subWeeks } from "date-fns";

interface DateNavigatorProps {
  date: string; // ISO format 'YYYY-MM-DD'
  viewType: "day" | "week";
  onDateChange: (newDate: string) => void;
}

export default function DateNavigator({
  date,
  viewType,
  onDateChange,
}: DateNavigatorProps) {
  const theme = useTheme();
  const dateObj = new Date(date);

  // Format the display text based on view type
  let displayText: string;
  if (viewType === "day") {
    displayText = format(dateObj, "MMMM d, yyyy");
  } else {
    // For week view, show the week range
    const weekStart = format(dateObj, "MMM d");
    const weekEnd = format(addDays(dateObj, 6), "MMM d, yyyy");
    displayText = `${weekStart} - ${weekEnd}`;
  }

  const handlePrevious = () => {
    const newDate =
      viewType === "day" ? subDays(dateObj, 1) : subWeeks(dateObj, 1);
    onDateChange(format(newDate, "yyyy-MM-dd"));
  };

  const handleNext = () => {
    const newDate =
      viewType === "day" ? addDays(dateObj, 1) : addWeeks(dateObj, 1);
    onDateChange(format(newDate, "yyyy-MM-dd"));
  };

  const handleToday = () => {
    onDateChange(format(new Date(), "yyyy-MM-dd"));
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon="chevron-left"
        size={24}
        onPress={handlePrevious}
        iconColor={theme.colors.primary}
      />
      <View style={styles.dateContainer}>
        <Text style={[styles.dateText, { color: theme.colors.onSurface }]}>
          {displayText}
        </Text>
        <TouchableOpacity onPress={handleToday} style={styles.todayButton}>
          <Text style={[styles.todayText, { color: theme.colors.primary }]}>
            Today
          </Text>
        </TouchableOpacity>
      </View>
      <IconButton
        icon="chevron-right"
        size={24}
        onPress={handleNext}
        iconColor={theme.colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  dateContainer: {
    flex: 1,
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
  },
  todayButton: {
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  todayText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

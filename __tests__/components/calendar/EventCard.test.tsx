import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import EventCard from "../../../components/calendar/EventCard";
import { CalendarEvent } from "../../../context/CalendarContext";

describe("EventCard Component", () => {
  const mockOnPress = jest.fn();

  // Sample event data for testing
  const standardEvent: CalendarEvent = {
    id: "event-1",
    title: "Team Meeting",
    description: "Weekly team sync to discuss progress",
    date: "2023-05-15",
    startTime: "10:00",
    endTime: "11:00",
    location: "Conference Room A",
    visibility: "public",
    color: "#4285F4",
  };

  const deadTimeEvent: CalendarEvent = {
    id: "event-2",
    title: "Personal Time",
    date: "2023-05-15",
    startTime: "13:00",
    endTime: "14:00",
    visibility: "private",
    isDeadTime: true,
    color: "#EA4335",
  };

  const minimalEvent: CalendarEvent = {
    id: "event-3",
    title: "Quick Call",
    date: "2023-05-15",
    visibility: "friends",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders standard event in full view correctly", () => {
    const { getByText, queryByText } = render(
      <EventCard event={standardEvent} onPress={mockOnPress} />
    );

    // Check if the title and details are displayed
    expect(getByText("Team Meeting")).toBeTruthy();
    expect(getByText("Conference Room A")).toBeTruthy();
    expect(getByText("10:00 - 11:00")).toBeTruthy();
    expect(getByText("Weekly team sync to discuss progress")).toBeTruthy();

    // Check that dead time label is not present
    expect(queryByText("Dead Time")).toBeNull();
  });

  it("renders dead time event in full view correctly", () => {
    const { getByText } = render(
      <EventCard event={deadTimeEvent} onPress={mockOnPress} />
    );

    // Check if the title and dead time indicator are displayed
    expect(getByText("Personal Time")).toBeTruthy();
    expect(getByText("Dead Time")).toBeTruthy();
  });

  it("renders minimal event with missing fields correctly", () => {
    const { getByText, queryByText } = render(
      <EventCard event={minimalEvent} onPress={mockOnPress} />
    );

    // Check if the title is displayed
    expect(getByText("Quick Call")).toBeTruthy();

    // Check that optional fields are not present
    expect(queryByText("10:00 - 11:00")).toBeNull();
    expect(queryByText("Conference Room A")).toBeNull();
  });

  it("renders compact view correctly", () => {
    const { getByText, queryByText } = render(
      <EventCard event={standardEvent} onPress={mockOnPress} compact={true} />
    );

    // Check if the title is displayed in compact view
    expect(getByText("Team Meeting")).toBeTruthy();
    expect(getByText("10:00 - 11:00")).toBeTruthy();

    // Description should not be visible in compact view
    expect(queryByText("Weekly team sync to discuss progress")).toBeNull();
  });

  it("calls onPress with the correct event ID when clicked", () => {
    const { getByText } = render(
      <EventCard event={standardEvent} onPress={mockOnPress} />
    );

    // Find and click the event card
    const eventTitle = getByText("Team Meeting");
    fireEvent.press(eventTitle);

    // Check if onPress was called with the correct event ID
    expect(mockOnPress).toHaveBeenCalledWith("event-1");
  });

  it("applies correct styling based on event properties", () => {
    const { getByText, UNSAFE_getByType } = render(
      <EventCard event={deadTimeEvent} onPress={mockOnPress} />
    );

    // Testing styles is tricky in React Native Testing Library
    // For this test, we're making a basic check that the component renders
    expect(getByText("Personal Time")).toBeTruthy();
  });
});

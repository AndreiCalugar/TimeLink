import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AgendaView from "../../../components/calendar/AgendaView";
import { CalendarEvent } from "../../../context/CalendarContext";

describe("AgendaView Component", () => {
  const mockOnEventPress = jest.fn();

  // Sample event data for testing
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

  // Add a day to today's date for tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  // Add 5 days to today's date for next week
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 5);
  const nextWeekStr = nextWeek.toISOString().split("T")[0];

  const mockEvents: Record<string, CalendarEvent[]> = {
    [todayStr]: [
      {
        id: "event-1",
        title: "Team Meeting",
        description: "Weekly team sync",
        date: todayStr,
        startTime: "10:00",
        endTime: "11:00",
        visibility: "public",
      },
      {
        id: "event-2",
        title: "Lunch Break",
        date: todayStr,
        startTime: "12:00",
        endTime: "13:00",
        visibility: "private",
      },
    ],
    [tomorrowStr]: [
      {
        id: "event-3",
        title: "Client Call",
        date: tomorrowStr,
        startTime: "14:00",
        endTime: "15:00",
        visibility: "public",
      },
    ],
    [nextWeekStr]: [
      {
        id: "event-4",
        title: "Conference",
        date: nextWeekStr,
        startTime: "09:00",
        endTime: "17:00",
        visibility: "public",
      },
    ],
  };

  const emptyEvents: Record<string, CalendarEvent[]> = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders events grouped by day", () => {
    const { getByText } = render(
      <AgendaView events={mockEvents} onEventPress={mockOnEventPress} />
    );

    // Check that section headers are displayed
    expect(getByText("Today")).toBeTruthy();
    expect(getByText("Tomorrow")).toBeTruthy();

    // Check that events are displayed
    expect(getByText("Team Meeting")).toBeTruthy();
    expect(getByText("Lunch Break")).toBeTruthy();
    expect(getByText("Client Call")).toBeTruthy();
    expect(getByText("Conference")).toBeTruthy();
  });

  it("triggers onEventPress when an event is clicked", () => {
    const { getByText } = render(
      <AgendaView events={mockEvents} onEventPress={mockOnEventPress} />
    );

    // Find and click an event
    const eventTitle = getByText("Team Meeting");
    fireEvent.press(eventTitle);

    // Check if onEventPress was called with the correct event ID
    expect(mockOnEventPress).toHaveBeenCalledWith("event-1");
  });

  it("displays empty state message when no events", () => {
    const { getByText } = render(
      <AgendaView events={emptyEvents} onEventPress={mockOnEventPress} />
    );

    // Check that the empty state message is displayed
    expect(getByText("No upcoming events in the next 14 days")).toBeTruthy();
  });

  it("respects the numberOfDays prop", () => {
    const { getByText } = render(
      <AgendaView
        events={emptyEvents}
        onEventPress={mockOnEventPress}
        numberOfDays={7}
      />
    );

    // Check that the empty state message shows the correct number of days
    expect(getByText("No upcoming events in the next 7 days")).toBeTruthy();
  });
});

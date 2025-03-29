import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CalendarScreen from "../../../app/(tabs)/calendar/index";
import { useCalendarContext } from "../../../context/CalendarContext";

// Mock the Calendar component from react-native-calendars
jest.mock("react-native-calendars", () => {
  return {
    Calendar: ({
      onDayPress,
    }: {
      onDayPress: (day: { dateString: string }) => void;
    }) => {
      return (
        <div
          data-testid="calendar-mock"
          onClick={() => onDayPress({ dateString: "2023-05-20" })}
        >
          Calendar Mock
        </div>
      );
    },
    DateData: {},
  };
});

// Mock the useCalendarContext hook
jest.mock("../../../context/CalendarContext", () => {
  return {
    useCalendarContext: jest.fn(() => ({
      events: {
        "2023-05-15": [
          {
            id: "event-1",
            title: "Team Meeting",
            date: "2023-05-15",
            visibility: "public",
          },
        ],
        "2023-05-20": [
          {
            id: "event-2",
            title: "Conference",
            date: "2023-05-20",
            visibility: "public",
          },
        ],
      },
      getEventsByDate: jest.fn((date) => {
        if (date === "2023-05-15") {
          return [
            {
              id: "event-1",
              title: "Team Meeting",
              date: "2023-05-15",
              visibility: "public",
            },
          ];
        } else if (date === "2023-05-20") {
          return [
            {
              id: "event-2",
              title: "Conference",
              date: "2023-05-20",
              visibility: "public",
            },
          ];
        }
        return [];
      }),
    })),
  };
});

describe("CalendarScreen Component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("renders with month view by default", () => {
    const { getByText, queryByTestId } = render(<CalendarScreen />);

    // Since Calendar is mocked, we can check for its presence
    expect(queryByTestId("calendar-mock")).toBeTruthy();

    // Events for the default date should be shown
    expect(getByText("Events for May 15, 2023")).toBeTruthy();
  });

  it("switches between different calendar views", () => {
    const { getByText, queryByText } = render(<CalendarScreen />);

    // Check that we're in month view (default)
    expect(queryByText("Events for May 15, 2023")).toBeTruthy();

    // Find and click the "Day" view button to switch to day view
    const dayButton = getByText("Day");
    fireEvent.press(dayButton);

    // Now we should see the day view
    expect(queryByText("Events for May 15, 2023")).toBeFalsy();

    // Find and click the "Week" view button to switch to week view
    const weekButton = getByText("Week");
    fireEvent.press(weekButton);

    // Now we should see the week view
    expect(getByText("Mon")).toBeTruthy();

    // Switch back to month view
    const monthButton = getByText("Month");
    fireEvent.press(monthButton);

    // Should see month view again
    expect(queryByText("Events for May 15, 2023")).toBeTruthy();
  });

  it("shows events for the selected date", () => {
    const { getByText } = render(<CalendarScreen />);

    // Default date should show Team Meeting
    expect(getByText("Team Meeting")).toBeTruthy();
  });

  it("handles date navigation in day view", () => {
    const { getByText, getByTestId } = render(<CalendarScreen />);

    // Switch to day view
    const dayButton = getByText("Day");
    fireEvent.press(dayButton);

    // Verify we're in day view
    expect(getByText("Monday, May 15, 2023")).toBeTruthy();

    // Navigate to next day
    const rightArrow = getByTestId("icon-chevron-right");
    fireEvent.press(rightArrow);

    // Verify date change
    expect(getByText("Tuesday, May 16, 2023")).toBeTruthy();

    // Navigate to previous day
    const leftArrow = getByTestId("icon-chevron-left");
    fireEvent.press(leftArrow);

    // Verify we're back
    expect(getByText("Monday, May 15, 2023")).toBeTruthy();
  });

  it("displays no events message when there are no events", () => {
    // Override mock for getEventsByDate to return empty array
    (useCalendarContext as jest.Mock).mockImplementation(() => ({
      events: {},
      getEventsByDate: () => [],
    }));

    const { getByText } = render(<CalendarScreen />);

    // Check that the no events message is displayed
    expect(getByText("No events scheduled for this day")).toBeTruthy();
  });
});

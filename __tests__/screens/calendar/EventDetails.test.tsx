import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import EventDetailsScreen from "../../../app/(tabs)/calendar/event/[id]";
import { useCalendarContext } from "../../../context/CalendarContext";
import { Share } from "react-native";

// Mock the useLocalSearchParams hook
jest.mock("expo-router", () => ({
  ...jest.requireActual("expo-router"),
  useLocalSearchParams: jest.fn(() => ({ id: "event-1" })),
  Stack: {
    Screen: jest.fn().mockReturnValue(null),
  },
}));

// Mock the useCalendarContext hook
jest.mock("../../../context/CalendarContext", () => ({
  useCalendarContext: jest.fn(),
}));

// Mock the Share API
jest.mock("react-native/Libraries/Share/Share", () => ({
  share: jest.fn(() => Promise.resolve({ action: "sharedAction" })),
}));

// Mock MaterialCommunityIcons
jest.mock("@expo/vector-icons", () => ({
  MaterialCommunityIcons: jest.fn().mockReturnValue(null),
}));

// Mock EventAttendees component
jest.mock("../../../components/calendar/EventAttendees", () => {
  return jest
    .fn()
    .mockImplementation(({ attendees }) => (
      <div data-testid="mock-attendees">{attendees.length} attendees</div>
    ));
});

describe("EventDetailsScreen", () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  const mockDeleteEvent = jest.fn();
  const mockEvent = {
    id: "event-1",
    title: "Team Meeting",
    description: "Weekly team sync",
    date: "2023-05-15",
    startTime: "10:00",
    endTime: "11:00",
    location: "Conference Room A",
    visibility: "public",
    color: "#4285F4",
    attendees: ["John Doe", "Jane Smith"],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock context return value
    (useCalendarContext as jest.Mock).mockReturnValue({
      getEventById: jest.fn().mockReturnValue(mockEvent),
      deleteEvent: mockDeleteEvent,
    });

    // Setup mock router
    (require("expo-router").useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders the event details correctly", () => {
    const { getByText } = render(<EventDetailsScreen />);

    // Check that essential event information is displayed
    expect(getByText("Team Meeting")).toBeTruthy();
    expect(getByText(/Conference Room A/i)).toBeTruthy();
    expect(getByText(/Weekly team sync/i)).toBeTruthy();
    expect(getByText(/public/i)).toBeTruthy();
  });

  it("navigates to edit screen when Edit button is pressed", () => {
    const { getByText } = render(<EventDetailsScreen />);

    // Find and press the Edit button
    const editButton = getByText("Edit Event");
    fireEvent.press(editButton);

    // Check that router.push was called with the correct route
    expect(mockRouter.push).toHaveBeenCalledWith("/calendar/edit/event-1");
  });

  it("shows delete confirmation dialog when Delete button is pressed", () => {
    const { getByText, queryByText } = render(<EventDetailsScreen />);

    // Initially, the dialog should not be visible
    expect(queryByText(/Are you sure you want to delete/i)).toBeNull();

    // Find and press the Delete button
    const deleteButton = getByText("Delete Event");
    fireEvent.press(deleteButton);

    // Now the dialog should be visible
    expect(getByText(/Are you sure you want to delete/i)).toBeTruthy();
  });

  it("deletes the event and goes back when confirmed", () => {
    const { getByText } = render(<EventDetailsScreen />);

    // Open the delete dialog
    const deleteButton = getByText("Delete Event");
    fireEvent.press(deleteButton);

    // Find and press the confirm delete button
    const confirmButton = getByText("Delete");
    fireEvent.press(confirmButton);

    // Check that deleteEvent was called with the correct id
    expect(mockDeleteEvent).toHaveBeenCalledWith("event-1");

    // Check that we navigated back
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it("shares the event when Share button is pressed", async () => {
    const { getByText } = render(<EventDetailsScreen />);

    // Find and press the Share button
    const shareButton = getByText("Share Event");
    fireEvent.press(shareButton);

    // Check that Share.share was called with event details
    expect(Share.share).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Team Meeting",
        message: expect.stringContaining("Team Meeting"),
      })
    );
  });

  it("displays attendees when they are present", () => {
    const { getByTestId } = render(<EventDetailsScreen />);

    // Check that the attendees component is rendered
    expect(getByTestId("mock-attendees")).toBeTruthy();
  });

  it("handles event not found scenario", () => {
    // Mock event not found
    (useCalendarContext as jest.Mock).mockReturnValue({
      getEventById: jest.fn().mockReturnValue(null),
      deleteEvent: mockDeleteEvent,
    });

    const { getByText } = render(<EventDetailsScreen />);

    // Check that we show a not found message
    expect(getByText("Event not found")).toBeTruthy();

    // Find and press the back button
    const backButton = getByText("Back to Calendar");
    fireEvent.press(backButton);

    // Check that we navigated back
    expect(mockRouter.back).toHaveBeenCalled();
  });
});

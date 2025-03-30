import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import EventDetailsScreen from "../../../app/(tabs)/calendar/event/[id]";
import { useCalendarContext } from "../../../context/CalendarContext";
import { Share } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

// Mock expo-font
jest.mock("expo-font", () => ({
  isLoaded: jest.fn().mockReturnValue(true),
  loadAsync: jest.fn().mockResolvedValue(true),
}));

// Create mock router
const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

// Mock the expo-router hooks
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(() => ({ id: "event-1" })),
  useRouter: jest.fn(() => mockRouter),
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
  MaterialCommunityIcons: ({
    name,
    size,
    color,
  }: {
    name: string;
    size: number;
    color: string;
  }) => {
    return React.createElement("Text", {}, `Icon-${name}`);
  },
}));

// Mock the Portal and Dialog components from react-native-paper
jest.mock("react-native-paper", () => {
  const ActualReactNativePaper = jest.requireActual("react-native-paper");
  return {
    ...ActualReactNativePaper,
    Portal: ({ children }: { children: React.ReactNode }) => children,
    Dialog: {
      Title: ({ children }: { children: React.ReactNode }) =>
        React.createElement("div", { "data-testid": "dialog-title" }, children),
      Content: ({ children }: { children: React.ReactNode }) =>
        React.createElement(
          "div",
          { "data-testid": "dialog-content" },
          children
        ),
      Actions: ({ children }: { children: React.ReactNode }) =>
        React.createElement(
          "div",
          { "data-testid": "dialog-actions" },
          children
        ),
    },
    Provider: ({ children }: { children: React.ReactNode }) => children,
    Button: ({
      onPress,
      children,
    }: {
      onPress: () => void;
      children: React.ReactNode;
    }) => React.createElement("button", { onClick: onPress }, children),
    Chip: ({ children }: { children: React.ReactNode }) =>
      React.createElement("span", {}, children),
    Card: {
      Title: ({ title }: { title: string }) =>
        React.createElement("div", {}, title),
      Content: ({ children }: { children: React.ReactNode }) =>
        React.createElement("div", {}, children),
    },
    Text: ({ children }: { children: React.ReactNode }) =>
      React.createElement("span", {}, children),
    IconButton: ({ icon, onPress }: { icon: string; onPress: () => void }) =>
      React.createElement("button", { onClick: onPress }, icon),
  };
});

// Mock EventAttendees component
jest.mock("../../../components/calendar/EventAttendees", () => {
  return jest
    .fn()
    .mockImplementation(({ attendees }) =>
      React.createElement(
        "div",
        { "data-testid": "mock-attendees" },
        `${attendees ? attendees.length : 0} attendees`
      )
    );
});

// Helper function to render with paper provider
const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui);
};

describe("EventDetailsScreen", () => {
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
  });

  it("renders the event details correctly", () => {
    const { getByText } = renderWithProviders(<EventDetailsScreen />);

    // Check that essential event information is displayed
    expect(getByText("Team Meeting")).toBeTruthy();
    expect(getByText(/Conference Room A/i)).toBeTruthy();
    expect(getByText(/Weekly team sync/i)).toBeTruthy();
    expect(getByText(/public/i)).toBeTruthy();
  });

  it("navigates to edit screen when Edit button is pressed", () => {
    const { getByText } = renderWithProviders(<EventDetailsScreen />);

    // Find and press the Edit button
    const editButton = getByText("Edit Event");
    fireEvent.press(editButton);

    // Check that router.push was called with the correct route
    expect(mockRouter.push).toHaveBeenCalledWith("/calendar/edit/event-1");
  });

  it("shows delete confirmation dialog when Delete button is pressed", () => {
    const { getByText, getByTestId } = renderWithProviders(
      <EventDetailsScreen />
    );

    // Find and press the Delete button
    const deleteButton = getByText("Delete Event");
    fireEvent.press(deleteButton);

    // Now the dialog should be visible
    expect(getByTestId("dialog-content")).toBeTruthy();
  });

  it("deletes the event and goes back when confirmed", () => {
    const { getByText } = renderWithProviders(<EventDetailsScreen />);

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
    const { getByText } = renderWithProviders(<EventDetailsScreen />);

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
    const { getByTestId } = renderWithProviders(<EventDetailsScreen />);

    // Check that the attendees component is rendered
    expect(getByTestId("mock-attendees")).toBeTruthy();
  });

  it("handles event not found scenario", () => {
    // Mock event not found
    (useCalendarContext as jest.Mock).mockReturnValue({
      getEventById: jest.fn().mockReturnValue(null),
      deleteEvent: mockDeleteEvent,
    });

    const { getByText } = renderWithProviders(<EventDetailsScreen />);

    // Check that we show a not found message
    expect(getByText("Event not found")).toBeTruthy();

    // Find and press the back button
    const backButton = getByText("Back to Calendar");
    fireEvent.press(backButton);

    // Check that we navigated back
    expect(mockRouter.back).toHaveBeenCalled();
  });
});

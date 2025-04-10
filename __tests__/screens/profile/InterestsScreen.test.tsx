import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import InterestsScreen from "../../../app/(tabs)/profile/interests";
import { useProfile } from "../../../context/ProfileContext";
import { useRouter } from "expo-router";

// Mock the useProfile hook
jest.mock("../../../context/ProfileContext", () => ({
  useProfile: jest.fn(),
}));

// Mock the router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

// Mock setTimeout
jest.useFakeTimers();

describe("InterestsScreen", () => {
  // Mock data
  const mockInterests = [
    { id: "int1", name: "Hiking", category: "Outdoors", icon: "mountain" },
    { id: "int2", name: "Reading", category: "Hobbies", icon: "book" },
    {
      id: "int-travel",
      name: "Travel",
      category: "Lifestyle",
      icon: "airplane",
    },
  ];

  const mockUserInterests = [
    { interestId: "int1", level: "enthusiast" },
    { interestId: "int2", level: "expert" },
  ];

  // Mock hooks
  const mockAddInterest = jest.fn();
  const mockRemoveInterest = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup the useProfile mock
    (useProfile as jest.Mock).mockReturnValue({
      interests: mockInterests,
      userInterests: mockUserInterests,
      addInterest: mockAddInterest,
      removeInterest: mockRemoveInterest,
    });

    // Setup the router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders correctly with initial interests", () => {
    const { getByText, getAllByText } = render(<InterestsScreen />);

    // Check if essential UI elements are present
    expect(getByText("Manage Interests")).toBeTruthy();
    expect(getByText("Your Interests")).toBeTruthy();
    expect(getByText("Add Custom Interest")).toBeTruthy();

    // Check if all interests are rendered
    expect(getByText("Hiking")).toBeTruthy();
    expect(getByText("Reading")).toBeTruthy();
    expect(getByText("Travel")).toBeTruthy();
  });

  it("allows searching for interests", () => {
    const { getByText, getByLabelText, queryByText } = render(
      <InterestsScreen />
    );

    // Get the search input
    const searchInput = getByLabelText("Search interests");

    // Search for "Hiking"
    fireEvent.changeText(searchInput, "Hiking");

    // "Hiking" should be visible but "Reading" should not
    expect(getByText("Hiking")).toBeTruthy();
    expect(queryByText("Reading")).toBeNull();
  });

  it("allows selecting and deselecting interests", () => {
    const { getByText } = render(<InterestsScreen />);

    // Initially, "Travel" is not selected but "Hiking" is
    const travelChip = getByText("Travel");
    const hikingChip = getByText("Hiking");

    // Select "Travel"
    fireEvent.press(travelChip);

    // Deselect "Hiking"
    fireEvent.press(hikingChip);

    // Save changes
    fireEvent.press(getByText("Save Changes"));

    // Check if addInterest was called for "Travel"
    expect(mockAddInterest).toHaveBeenCalledWith("int-travel");

    // Check if removeInterest was called for "Hiking"
    expect(mockRemoveInterest).toHaveBeenCalledWith("int1");
  });

  it("allows adding a custom interest", () => {
    const { getByText, getByLabelText, getAllByText } = render(
      <InterestsScreen />
    );

    // Enter a custom interest name
    const nameInput = getByLabelText("Interest Name");
    fireEvent.changeText(nameInput, "Custom Interest");

    // Find the add button - using text content instead of testID
    const addButtons = getAllByText("+");
    const addButton = addButtons[0]; // Get the first one if there are multiple

    // Add the custom interest
    fireEvent.press(addButton);

    // New interest should be automatically selected
    expect(getByText("Custom Interest")).toBeTruthy();

    // Save changes
    fireEvent.press(getByText("Save Changes"));

    // The addInterest should have been called for the new custom interest
    expect(mockAddInterest).toHaveBeenCalled();

    // Check that we navigate back after saving
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(mockPush).toHaveBeenCalledWith("/(tabs)/profile");
  });

  it("navigates back to profile after saving changes", () => {
    const { getByText } = render(<InterestsScreen />);

    // Make a change to enable the save button
    fireEvent.press(getByText("Travel"));

    // Save changes
    fireEvent.press(getByText("Save Changes"));

    // Check that setTimeout was called
    expect(setTimeout).toHaveBeenCalled();

    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // Check that we navigated to the profile
    expect(mockPush).toHaveBeenCalledWith("/(tabs)/profile");
  });
});

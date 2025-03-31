import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AppHeader from "../../../components/ui/AppHeader";

// Mock the router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

describe("AppHeader", () => {
  it("renders with title correctly", () => {
    const { getByText } = render(<AppHeader title="Test Header" />);
    expect(getByText("Test Header")).toBeTruthy();
  });

  it("renders without back button by default", () => {
    const { queryByTestId } = render(<AppHeader title="Test Header" />);
    // This assumes that the Appbar.BackAction has a testID or can be located by role
    expect(queryByTestId("back-button")).toBeNull();
  });

  it("renders with back button when showBackButton is true", () => {
    const { UNSAFE_getByProps } = render(
      <AppHeader title="Test Header" showBackButton={true} />
    );

    // Test that an element with icon='arrow-left' exists (this is the back button)
    const backButton = UNSAFE_getByProps({ icon: "arrow-left" });
    expect(backButton).toBeTruthy();
  });

  it("renders with action icon when provided", () => {
    const { UNSAFE_getByProps } = render(
      <AppHeader title="Test Header" rightActionIcon="magnify" />
    );

    // Test that an element with icon='magnify' exists
    const actionButton = UNSAFE_getByProps({ icon: "magnify" });
    expect(actionButton).toBeTruthy();
  });

  it("calls onRightActionPress when action icon is pressed", () => {
    const onRightActionPress = jest.fn();
    const { UNSAFE_getByProps } = render(
      <AppHeader
        title="Test Header"
        rightActionIcon="magnify"
        onRightActionPress={onRightActionPress}
      />
    );

    // Find and press the action button
    const actionButton = UNSAFE_getByProps({ icon: "magnify" });
    fireEvent.press(actionButton);

    // Check that the callback was called
    expect(onRightActionPress).toHaveBeenCalled();
  });
});

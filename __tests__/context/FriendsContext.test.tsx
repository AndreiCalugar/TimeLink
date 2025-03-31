import React from "react";
import { render } from "@testing-library/react-native";
import { FriendsProvider, useFriends } from "../../context/FriendsContext";
import { Text } from "react-native";

// Mock the contexts that FriendsContext depends on
jest.mock("../../context/UserContext", () => ({
  useUser: () => ({
    user: { id: "user1", name: "Test User" },
  }),
}));

jest.mock("../../context/ProfileContext", () => ({
  useProfile: () => ({
    friends: [
      {
        id: "user2",
        name: "Jane Smith",
        profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
        status: "accepted",
        since: "2023-02-10",
      },
    ],
  }),
}));

jest.mock("../../context/DiscoveryContext", () => ({
  useDiscovery: () => ({
    events: [],
  }),
}));

// Create a simple test component that uses the FriendsContext
const TestComponent = () => {
  const { isLoading } = useFriends();
  return <Text>{isLoading ? "Loading..." : "Loaded"}</Text>;
};

describe("FriendsContext", () => {
  it("renders without crashing", () => {
    // Simply test that the provider renders without crashing
    const { getByText } = render(
      <FriendsProvider>
        <TestComponent />
      </FriendsProvider>
    );

    // We don't care about the actual content right now,
    // just that it renders something
    expect(getByText(/Loading...|Loaded/)).toBeTruthy();
  });
});

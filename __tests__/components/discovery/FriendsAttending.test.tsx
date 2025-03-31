import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FriendsAttending from "../../../components/discovery/FriendsAttending";
import { router } from "expo-router";

// Mock router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock the useFriends hook
jest.mock("../../../context/FriendsContext", () => ({
  useFriends: () => ({
    getFriendsAttendingEvent: (eventId: string) => {
      if (eventId === "event-with-friends") {
        return [
          {
            id: "user1",
            name: "Alice Johnson",
            profilePicture: "https://randomuser.me/api/portraits/women/1.jpg",
            status: "accepted",
          },
          {
            id: "user2",
            name: "Bob Smith",
            profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
            status: "accepted",
          },
          {
            id: "user3",
            name: "Carol White",
            profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
            status: "accepted",
          },
          {
            id: "user4",
            name: "Dave Brown",
            profilePicture: "https://randomuser.me/api/portraits/men/2.jpg",
            status: "accepted",
          },
        ];
      } else if (eventId === "event-with-one-friend") {
        return [
          {
            id: "user1",
            name: "Alice Johnson",
            profilePicture: "https://randomuser.me/api/portraits/women/1.jpg",
            status: "accepted",
          },
        ];
      } else {
        return [];
      }
    },
  }),
}));

describe("FriendsAttending Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders friends attending an event with limit", () => {
    const { getByText, getAllByTestId } = render(
      <FriendsAttending eventId="event-with-friends" maxDisplay={2} />
    );

    // It should display 2 friends (maxDisplay) + "+2" and "More" indicators
    const avatars = getAllByTestId("friend-avatar");
    expect(avatars.length).toBe(2);
    expect(getByText("+2")).toBeTruthy();
    expect(getByText("More")).toBeTruthy();
  });

  it("renders all friends when count is less than maxDisplay", () => {
    const { queryByText, getAllByTestId } = render(
      <FriendsAttending eventId="event-with-one-friend" maxDisplay={3} />
    );

    // It should display 1 friend and no "more" indicator
    const avatars = getAllByTestId("friend-avatar");
    expect(avatars.length).toBe(1);
    expect(queryByText(/\+\d+/)).toBeNull();
  });

  it("renders nothing when no friends are attending", () => {
    const { queryByTestId } = render(
      <FriendsAttending eventId="event-with-no-friends" maxDisplay={3} />
    );

    // It should not display anything
    expect(queryByTestId("friends-attending-container")).toBeNull();
  });

  it("navigates to friend profile when a friend avatar is pressed", () => {
    const { getAllByTestId } = render(
      <FriendsAttending eventId="event-with-friends" maxDisplay={2} />
    );

    // Press the first friend avatar
    const avatars = getAllByTestId("friend-avatar");
    fireEvent.press(avatars[0]);

    // Check if router.push was called with the correct route
    expect(router.push).toHaveBeenCalledWith({
      pathname: "/(tabs)/friends/friend/[friendId]",
      params: { friendId: "user1" },
    });
  });
});

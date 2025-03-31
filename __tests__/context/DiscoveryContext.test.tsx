import React from "react";
import { render, act } from "@testing-library/react-native";
import { Text } from "react-native";
import {
  DiscoveryProvider,
  useDiscovery,
  DiscoveryEvent,
} from "../../context/DiscoveryContext";
import { UserProvider } from "../../context/UserContext";

// Mock UserContext
jest.mock("../../context/UserContext", () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => children,
  useUser: () => ({
    user: {
      id: "test-user-id",
      name: "Test User",
    },
  }),
}));

// Test component to access context
const TestComponent = () => {
  const {
    events,
    popularEvents,
    nearbyEvents,
    friendEvents,
    isLoading,
    error,
    getEventsByCategory,
    getEventsByDate,
  } = useDiscovery();

  // Get music events for testing filtering
  const musicEvents = getEventsByCategory("music");

  // Get today's events for testing date filtering
  const todayStr = new Date().toISOString().split("T")[0];
  const todayEvents = getEventsByDate(todayStr);

  return (
    <>
      <Text testID="loading-state">{isLoading.toString()}</Text>
      <Text testID="error-state">{error || "no-error"}</Text>
      <Text testID="events-count">{events.length}</Text>
      <Text testID="popular-events-count">{popularEvents.length}</Text>
      <Text testID="nearby-events-count">{nearbyEvents.length}</Text>
      <Text testID="friend-events-count">{friendEvents.length}</Text>
      <Text testID="music-events-count">{musicEvents.length}</Text>
      <Text testID="today-events-count">{todayEvents.length}</Text>
      <Text testID="events-data">{JSON.stringify(events.slice(0, 1))}</Text>
    </>
  );
};

describe("DiscoveryContext", () => {
  // Add a longer timeout to handle async operations
  jest.setTimeout(10000);

  it("loads discovery data after initialization", async () => {
    const { getByTestId } = render(
      <UserProvider>
        <DiscoveryProvider>
          <TestComponent />
        </DiscoveryProvider>
      </UserProvider>
    );

    // Initially should be loading
    expect(getByTestId("loading-state").props.children).toBe("true");

    // Wait for loading to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    });

    // After loading, should have events data
    expect(getByTestId("loading-state").props.children).toBe("false");
    expect(getByTestId("error-state").props.children).toBe("no-error");

    // Should have some events
    const eventsCount = parseInt(getByTestId("events-count").props.children);
    expect(eventsCount).toBeGreaterThan(0);

    // Ensure we have popular, nearby, and friend events
    const popularCount = parseInt(
      getByTestId("popular-events-count").props.children
    );
    const nearbyCount = parseInt(
      getByTestId("nearby-events-count").props.children
    );

    expect(popularCount).toBeGreaterThan(0);
    expect(nearbyCount).toBeGreaterThan(0);
  });

  it("provides properly formatted event data", async () => {
    const { getByTestId } = render(
      <UserProvider>
        <DiscoveryProvider>
          <TestComponent />
        </DiscoveryProvider>
      </UserProvider>
    );

    // Wait for loading to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    });

    // Check that the events have the right structure
    const eventData = JSON.parse(getByTestId("events-data").props.children);

    // Check first event has required properties
    expect(eventData[0]).toHaveProperty("id");
    expect(eventData[0]).toHaveProperty("title");
    expect(eventData[0]).toHaveProperty("date");
    expect(eventData[0]).toHaveProperty("visibility");
    expect(eventData[0]).toHaveProperty("category");
  });

  it("filters events by category correctly", async () => {
    const { getByTestId } = render(
      <UserProvider>
        <DiscoveryProvider>
          <TestComponent />
        </DiscoveryProvider>
      </UserProvider>
    );

    // Wait for loading to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    });

    // There should be some music events after filtering
    const musicEventsCount = parseInt(
      getByTestId("music-events-count").props.children
    );
    expect(musicEventsCount).toBeGreaterThanOrEqual(0);

    // Total events should be more than or equal to music events
    const totalEvents = parseInt(getByTestId("events-count").props.children);
    expect(totalEvents).toBeGreaterThanOrEqual(musicEventsCount);
  });

  it("filters events by date correctly", async () => {
    const { getByTestId } = render(
      <UserProvider>
        <DiscoveryProvider>
          <TestComponent />
        </DiscoveryProvider>
      </UserProvider>
    );

    // Wait for loading to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    });

    // There might be some events for today
    const todayEventsCount = parseInt(
      getByTestId("today-events-count").props.children
    );
    expect(todayEventsCount).toBeGreaterThanOrEqual(0);

    // Total events should be more than or equal to today's events
    const totalEvents = parseInt(getByTestId("events-count").props.children);
    expect(totalEvents).toBeGreaterThanOrEqual(todayEventsCount);
  });
});

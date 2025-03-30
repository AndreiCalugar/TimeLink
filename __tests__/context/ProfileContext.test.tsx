import React from "react";
import { render, act } from "@testing-library/react-native";
import { Text } from "react-native";
import { ProfileProvider, useProfile } from "../../context/ProfileContext";
import { UserProvider } from "../../context/UserContext";

// Increase the test timeout for async operations
jest.setTimeout(10000);

// Mock the UserContext to provide a consistent user for testing
jest.mock("../../context/UserContext", () => {
  const mockUser = {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
  };

  return {
    ...jest.requireActual("../../context/UserContext"),
    useUser: () => ({
      user: mockUser,
      setUser: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
    }),
  };
});

// Test component to access context
const TestComponent = () => {
  const {
    profile,
    isLoading,
    friends,
    photos,
    interests,
    userInterests,
    getVisibleEvents,
    getVisiblePhotos,
  } = useProfile();

  return (
    <>
      <Text testID="loading-state">{isLoading.toString()}</Text>
      <Text testID="profile-data">{JSON.stringify(profile)}</Text>
      <Text testID="friends-data">{JSON.stringify(friends)}</Text>
      <Text testID="photos-data">{JSON.stringify(photos)}</Text>
      <Text testID="interests-data">{JSON.stringify(interests)}</Text>
      <Text testID="user-interests-data">{JSON.stringify(userInterests)}</Text>
    </>
  );
};

describe("ProfileContext", () => {
  // Add a longer timeout to handle async operations
  jest.setTimeout(10000);

  it("initializes with loading state", () => {
    const { getByTestId } = render(
      <UserProvider>
        <ProfileProvider>
          <TestComponent />
        </ProfileProvider>
      </UserProvider>
    );

    // Initial state should be loading
    expect(getByTestId("loading-state").props.children).toBe("true");
  });

  it("loads profile data after initialization", async () => {
    const { getByTestId } = render(
      <UserProvider>
        <ProfileProvider>
          <TestComponent />
        </ProfileProvider>
      </UserProvider>
    );

    // Wait for loading to complete (increase wait time)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    // Loading should be complete
    expect(getByTestId("loading-state").props.children).toBe("false");

    // Profile data should be loaded
    const profileData = JSON.parse(getByTestId("profile-data").props.children);
    expect(profileData).toBeTruthy();
    expect(profileData.name).toBeTruthy();
  });

  it("provides friends data", async () => {
    const { getByTestId } = render(
      <UserProvider>
        <ProfileProvider>
          <TestComponent />
        </ProfileProvider>
      </UserProvider>
    );

    // Wait for loading to complete (increase wait time)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    // Friends data should be an array
    const friendsData = JSON.parse(getByTestId("friends-data").props.children);
    expect(Array.isArray(friendsData)).toBe(true);
  });

  it("provides photos data", async () => {
    const { getByTestId } = render(
      <UserProvider>
        <ProfileProvider>
          <TestComponent />
        </ProfileProvider>
      </UserProvider>
    );

    // Wait for loading to complete (increase wait time)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    // Photos data should be an array
    const photosData = JSON.parse(getByTestId("photos-data").props.children);
    expect(Array.isArray(photosData)).toBe(true);
  });

  it("provides interests data", async () => {
    const { getByTestId } = render(
      <UserProvider>
        <ProfileProvider>
          <TestComponent />
        </ProfileProvider>
      </UserProvider>
    );

    // Wait for loading to complete (increase wait time)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    // Interests data should be an array
    const interestsData = JSON.parse(
      getByTestId("interests-data").props.children
    );
    expect(Array.isArray(interestsData)).toBe(true);
  });

  it("provides user interests data", async () => {
    const { getByTestId } = render(
      <UserProvider>
        <ProfileProvider>
          <TestComponent />
        </ProfileProvider>
      </UserProvider>
    );

    // Wait for loading to complete (increase wait time)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    // User interests data should be an array
    const userInterestsData = JSON.parse(
      getByTestId("user-interests-data").props.children
    );
    expect(Array.isArray(userInterestsData)).toBe(true);
  });
});

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { useProfile } from "./ProfileContext";
import { Friend } from "../types/profile";

// Extended Friend interface with additional properties
export interface FriendExtended extends Friend {
  mutualFriends?: number;
  mutualEvents?: number;
  interests?: string[];
  upcomingEvents?: string[]; // IDs of events they're attending
}

// Interface for friend suggestions
export interface FriendSuggestion {
  id: string;
  name: string;
  profilePicture?: string;
  mutualFriends: number;
  mutualInterests?: string[];
  bio?: string;
}

// Interface for friend request
export interface FriendRequest {
  id: string;
  userId: string;
  name: string;
  profilePicture?: string;
  requestDate: string;
  status: "pending" | "accepted" | "declined";
}

interface FriendsContextType {
  friends: FriendExtended[];
  friendRequests: FriendRequest[];
  friendSuggestions: FriendSuggestion[];
  isLoading: boolean;
  error: string | null;
  // Friend management functions
  sendFriendRequest: (userId: string) => Promise<boolean>;
  acceptFriendRequest: (requestId: string) => Promise<boolean>;
  declineFriendRequest: (requestId: string) => Promise<boolean>;
  removeFriend: (friendId: string) => Promise<boolean>;
  // Friend retrieval functions
  getFriendsAttendingEvent: (eventId: string) => FriendExtended[];
  getFriendById: (friendId: string) => FriendExtended | null;
  searchFriends: (query: string) => FriendExtended[];
  refreshFriends: () => Promise<void>;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const { friends: profileFriends } = useProfile();

  const [friends, setFriends] = useState<FriendExtended[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendSuggestions, setFriendSuggestions] = useState<
    FriendSuggestion[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Generate mock data for development
  const generateMockFriends = (): FriendExtended[] => {
    // Starting with profile friends (accepted friends)
    const acceptedFriends = profileFriends
      .filter((friend) => friend.status === "accepted")
      .map((friend) => {
        // Use consistent values instead of random values to prevent UI flashing
        const mutualFriends =
          friend.id === "user2" ? 5 : friend.id === "user3" ? 3 : 1;
        const mutualEvents =
          friend.id === "user2" ? 2 : friend.id === "user3" ? 1 : 0;

        // Consistent interests for each friend
        const interests =
          friend.id === "user2"
            ? ["Music", "Travel", "Art"]
            : friend.id === "user3"
            ? ["Sports", "Technology"]
            : ["Books", "Food"];

        // Consistent upcoming events
        const upcomingEvents =
          friend.id === "user2"
            ? ["event-1", "event-5"]
            : friend.id === "user3"
            ? ["event-3"]
            : [];

        return {
          ...friend,
          mutualFriends,
          mutualEvents,
          interests,
          upcomingEvents,
        };
      });

    return acceptedFriends;
  };

  const generateMockFriendRequests = (): FriendRequest[] => {
    // Get pending friends from profile
    const pendingFriends = profileFriends
      .filter((friend) => friend.status === "pending")
      .map((friend) => ({
        id: `req-${friend.id}`,
        userId: friend.id,
        name: friend.name,
        profilePicture: friend.profilePicture,
        requestDate: friend.since || new Date().toISOString().split("T")[0],
        status: "pending" as const,
      }));

    // Add some mock incoming requests
    const incomingRequests: FriendRequest[] = [
      {
        id: "req-incoming-1",
        userId: "user10",
        name: "Robert Chen",
        profilePicture: "https://randomuser.me/api/portraits/men/52.jpg",
        requestDate: new Date().toISOString().split("T")[0],
        status: "pending",
      },
      {
        id: "req-incoming-2",
        userId: "user11",
        name: "Amanda Garcia",
        profilePicture: "https://randomuser.me/api/portraits/women/67.jpg",
        requestDate: new Date().toISOString().split("T")[0],
        status: "pending",
      },
    ];

    return [...pendingFriends, ...incomingRequests];
  };

  const generateMockFriendSuggestions = (): FriendSuggestion[] => {
    // Create mock suggestions data
    return [
      {
        id: "user12",
        name: "Jessica Williams",
        profilePicture: "https://randomuser.me/api/portraits/women/42.jpg",
        mutualFriends: 5,
        mutualInterests: ["Music", "Travel", "Photography"],
        bio: "Concert lover and world traveler",
      },
      {
        id: "user13",
        name: "Daniel Brown",
        profilePicture: "https://randomuser.me/api/portraits/men/33.jpg",
        mutualFriends: 3,
        mutualInterests: ["Sports", "Technology"],
        bio: "Software engineer and sports enthusiast",
      },
      {
        id: "user14",
        name: "Michelle Lee",
        profilePicture: "https://randomuser.me/api/portraits/women/89.jpg",
        mutualFriends: 7,
        mutualInterests: ["Art", "Food", "Movies"],
        bio: "Art gallery curator and foodie",
      },
      {
        id: "user15",
        name: "Thomas Jackson",
        profilePicture: "https://randomuser.me/api/portraits/men/77.jpg",
        mutualFriends: 2,
        mutualInterests: ["Gaming", "Technology"],
        bio: "Game developer and tech enthusiast",
      },
      {
        id: "user16",
        name: "Sophia Martinez",
        profilePicture: "https://randomuser.me/api/portraits/women/28.jpg",
        mutualFriends: 4,
        mutualInterests: ["Books", "Travel", "Music"],
        bio: "Book lover and amateur musician",
      },
    ];
  };

  useEffect(() => {
    const loadFriendsData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate mock data
        const mockFriends = generateMockFriends();
        const mockRequests = generateMockFriendRequests();
        const mockSuggestions = generateMockFriendSuggestions();

        setFriends(mockFriends);
        setFriendRequests(mockRequests);
        setFriendSuggestions(mockSuggestions);
      } catch (err) {
        console.error("Error loading friends data:", err);
        setError("Failed to load friends data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadFriendsData();
    }
  }, [user, profileFriends]);

  // When refreshing, keep existing data if it exists to prevent frequent UI changes
  const refreshFriends = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // First time loading - generate all mock data
      if (friends.length === 0) {
        const mockFriends = generateMockFriends();
        const mockRequests = generateMockFriendRequests();
        const mockSuggestions = generateMockFriendSuggestions();

        setFriends(mockFriends);
        setFriendRequests(mockRequests);
        setFriendSuggestions(mockSuggestions);
      } else {
        // On refresh, only reload if new profile friends exist that aren't in current friends
        const currentFriendIds = friends.map((f) => f.id);
        const acceptedProfileFriends = profileFriends.filter(
          (f) => f.status === "accepted" && !currentFriendIds.includes(f.id)
        );

        if (acceptedProfileFriends.length > 0) {
          // We have new accepted friends to add
          const newFriends = generateMockFriends();
          setFriends(newFriends);
        }
      }
    } catch (err) {
      console.error("Error refreshing friends data:", err);
      setError("Failed to refresh friends data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendFriendRequest = async (userId: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if already a friend or already requested
      const existingFriend = friends.find((f) => f.id === userId);
      const existingRequest = friendRequests.find((r) => r.userId === userId);

      if (existingFriend || existingRequest) {
        return false;
      }

      // Find user in suggestions
      const user = friendSuggestions.find((s) => s.id === userId);

      if (!user) {
        return false;
      }

      // Create new request
      const newRequest: FriendRequest = {
        id: `req-${userId}`,
        userId,
        name: user.name,
        profilePicture: user.profilePicture,
        requestDate: new Date().toISOString().split("T")[0],
        status: "pending",
      };

      setFriendRequests((prev) => [...prev, newRequest]);
      return true;
    } catch (err) {
      console.error("Error sending friend request:", err);
      return false;
    }
  };

  const acceptFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find the request
      const request = friendRequests.find((r) => r.id === requestId);

      if (!request) {
        return false;
      }

      // Update request status
      setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));

      // Add to friends
      const newFriend: FriendExtended = {
        id: request.userId,
        name: request.name,
        profilePicture: request.profilePicture,
        status: "accepted",
        since: new Date().toISOString().split("T")[0],
        mutualFriends: Math.floor(Math.random() * 5),
        mutualEvents: Math.floor(Math.random() * 3),
        interests: ["Music", "Travel"],
        upcomingEvents: [],
      };

      setFriends((prev) => [...prev, newFriend]);
      return true;
    } catch (err) {
      console.error("Error accepting friend request:", err);
      return false;
    }
  };

  const declineFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove request
      setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));

      return true;
    } catch (err) {
      console.error("Error declining friend request:", err);
      return false;
    }
  };

  const removeFriend = async (friendId: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove friend
      setFriends((prev) => prev.filter((f) => f.id !== friendId));

      return true;
    } catch (err) {
      console.error("Error removing friend:", err);
      return false;
    }
  };

  const getFriendsAttendingEvent = (eventId: string): FriendExtended[] => {
    return friends.filter((friend) => friend.upcomingEvents?.includes(eventId));
  };

  const getFriendById = (friendId: string): FriendExtended | null => {
    return friends.find((friend) => friend.id === friendId) || null;
  };

  const searchFriends = (query: string): FriendExtended[] => {
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      return friends;
    }

    return friends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(lowerQuery) ||
        friend.interests?.some((interest) =>
          interest.toLowerCase().includes(lowerQuery)
        )
    );
  };

  return (
    <FriendsContext.Provider
      value={{
        friends,
        friendRequests,
        friendSuggestions,
        isLoading,
        error,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        getFriendsAttendingEvent,
        getFriendById,
        searchFriends,
        refreshFriends,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (context === undefined) {
    throw new Error("useFriends must be used within a FriendsProvider");
  }
  return context;
};

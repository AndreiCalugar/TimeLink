import React, { createContext, useContext, useState, useEffect } from "react";
import { CalendarEvent, EventVisibility } from "./CalendarContext";
import { useUser } from "./UserContext";

// Define an extended event type with discovery-specific properties
export interface DiscoveryEvent extends CalendarEvent {
  attendingCount?: number;
  friendsAttending?: { id: string; name: string; profilePicture?: string }[]; // Updated to include friend details
  category?: string; // Event category like "sports", "music", etc.
  image?: string; // URL for event image
}

interface DiscoveryContextType {
  events: DiscoveryEvent[];
  popularEvents: DiscoveryEvent[];
  nearbyEvents: DiscoveryEvent[];
  friendEvents: DiscoveryEvent[];
  isLoading: boolean;
  error: string | null;
  refreshEvents: () => Promise<void>;
  getEventsByCategory: (category: string) => DiscoveryEvent[];
  getEventsByLocation: (
    latitude: number,
    longitude: number,
    radius: number
  ) => DiscoveryEvent[];
  getEventsByDate: (date: string) => DiscoveryEvent[];
  getMutualEvents: (friendId: string) => DiscoveryEvent[];
}

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(
  undefined
);

export const DiscoveryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<DiscoveryEvent[]>([]);
  const [popularEvents, setPopularEvents] = useState<DiscoveryEvent[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<DiscoveryEvent[]>([]);
  const [friendEvents, setFriendEvents] = useState<DiscoveryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();

  // Mock data for development
  const generateMockEvents = (): DiscoveryEvent[] => {
    // Create a range of dates for the next 14 days
    const dates = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date.toISOString().split("T")[0];
    });

    // Categories for events
    const categories = [
      "sports",
      "music",
      "food",
      "art",
      "technology",
      "education",
      "networking",
      "games",
      "outdoors",
      "health",
    ];

    // Mock locations (could be replaced with real geo data)
    const locations = [
      "Downtown Community Center",
      "Central Park",
      "Public Library",
      "Art Gallery",
      "Sports Complex",
      "Tech Hub",
      "University Campus",
      "Local Cafe",
      "Riverside Park",
      "Convention Center",
    ];

    // Mock friends data (simplified)
    const mockFriends = [
      {
        id: "friend1",
        name: "Alex Johnson",
        profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        id: "friend2",
        name: "Emma Smith",
        profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      {
        id: "friend3",
        name: "Michael Brown",
        profilePicture: "https://randomuser.me/api/portraits/men/3.jpg",
      },
      {
        id: "friend4",
        name: "Olivia Davis",
        profilePicture: "https://randomuser.me/api/portraits/women/4.jpg",
      },
      {
        id: "friend5",
        name: "William Wilson",
        profilePicture: "https://randomuser.me/api/portraits/men/5.jpg",
      },
    ];

    // Generate 50 mock events
    return Array.from({ length: 50 }, (_, i) => {
      const randomDate = dates[Math.floor(Math.random() * dates.length)];
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      const randomLocation =
        locations[Math.floor(Math.random() * locations.length)];
      const attendingCount = Math.floor(Math.random() * 50) + 5; // 5-55 people

      // Random time between 8am and 10pm
      const randomHour = Math.floor(Math.random() * 14) + 8;
      const randomMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
      const startTime = `${randomHour
        .toString()
        .padStart(2, "0")}:${randomMinute.toString().padStart(2, "0")}`;

      // Random duration between 1-3 hours
      const durationHours = Math.floor(Math.random() * 3) + 1;
      let endHour = randomHour + durationHours;
      const endTime = `${endHour.toString().padStart(2, "0")}:${randomMinute
        .toString()
        .padStart(2, "0")}`;

      // Random friends attending (0-3 friends)
      const friendsAttending = Array.from(
        { length: Math.floor(Math.random() * 4) },
        () => {
          const randomFriend =
            mockFriends[Math.floor(Math.random() * mockFriends.length)];
          return randomFriend;
        }
      );

      return {
        id: `event-${i + 1}`,
        title: `Event ${i + 1}`,
        description: `Description for event ${
          i + 1
        }. This is a ${randomCategory} event happening at ${randomLocation}.`,
        date: randomDate,
        startTime,
        endTime,
        location: randomLocation,
        attendingCount,
        friendsAttending,
        category: randomCategory,
        image: `https://source.unsplash.com/random/300x200?${randomCategory}`,
        visibility: "public",
      };
    });
  };

  useEffect(() => {
    // In a real app, this would fetch data from an API
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate mock events
        const mockEvents = generateMockEvents();
        setEvents(mockEvents);

        // Set popular events (those with most attendees)
        const popular = [...mockEvents]
          .sort((a, b) => (b.attendingCount || 0) - (a.attendingCount || 0))
          .slice(0, 10);
        setPopularEvents(popular);

        // Set nearby events (random subset for mock)
        const nearby = [...mockEvents]
          .sort(() => 0.5 - Math.random())
          .slice(0, 10);
        setNearbyEvents(nearby);

        // Set events with friends attending
        const withFriends = mockEvents.filter(
          (event) => event.friendsAttending && event.friendsAttending.length > 0
        );
        setFriendEvents(withFriends);
      } catch (err) {
        setError("Failed to fetch events. Please try again later.");
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user?.id]); // Refetch when user changes

  const refreshEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate new mock events
      const mockEvents = generateMockEvents();
      setEvents(mockEvents);

      // Update filtered event sets
      const popular = [...mockEvents]
        .sort((a, b) => (b.attendingCount || 0) - (a.attendingCount || 0))
        .slice(0, 10);
      setPopularEvents(popular);

      const nearby = [...mockEvents]
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);
      setNearbyEvents(nearby);

      const withFriends = mockEvents.filter(
        (event) => event.friendsAttending && event.friendsAttending.length > 0
      );
      setFriendEvents(withFriends);
    } catch (err) {
      setError("Failed to refresh events. Please try again later.");
      console.error("Error refreshing events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventsByCategory = (category: string): DiscoveryEvent[] => {
    return events.filter((event) => event.category === category);
  };

  const getEventsByLocation = (
    latitude: number,
    longitude: number,
    radius: number
  ): DiscoveryEvent[] => {
    // In a real app, this would use geo calculations
    // For now, we'll just return nearby events
    return nearbyEvents;
  };

  const getEventsByDate = (date: string): DiscoveryEvent[] => {
    return events.filter((event) => event.date === date);
  };

  const getMutualEvents = (friendId: string): DiscoveryEvent[] => {
    return events.filter((event) =>
      event.friendsAttending?.some((friend) => friend.id === friendId)
    );
  };

  return (
    <DiscoveryContext.Provider
      value={{
        events,
        popularEvents,
        nearbyEvents,
        friendEvents,
        isLoading,
        error,
        refreshEvents,
        getEventsByCategory,
        getEventsByLocation,
        getEventsByDate,
        getMutualEvents,
      }}
    >
      {children}
    </DiscoveryContext.Provider>
  );
};

export const useDiscovery = () => {
  const context = useContext(DiscoveryContext);
  if (context === undefined) {
    throw new Error("useDiscovery must be used within a DiscoveryProvider");
  }
  return context;
};

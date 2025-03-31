import React, { createContext, useContext, useState, useEffect } from "react";
import { CalendarEvent } from "./CalendarContext";
import { useUser } from "./UserContext";

// Define an extended event type with discovery-specific properties
export interface DiscoveryEvent extends CalendarEvent {
  attendingCount?: number;
  friendsAttending?: string[]; // IDs of friends attending
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

    // Generate 30 mock events
    return Array.from({ length: 30 }, (_, i) => {
      const randomDate = dates[Math.floor(Math.random() * dates.length)];
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      const randomLocation =
        locations[Math.floor(Math.random() * locations.length)];
      const attendingCount = Math.floor(Math.random() * 50);

      // Generate a time between 8AM and 10PM
      const hour = 8 + Math.floor(Math.random() * 14);
      const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45
      const startTime = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;

      // End time is 1-3 hours after start
      const endHour = hour + 1 + Math.floor(Math.random() * 2);
      const endTime = `${endHour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;

      return {
        id: `event-${i + 1}`,
        title: `${
          randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1)
        } Event ${i + 1}`,
        description: `This is a ${randomCategory} event happening at ${randomLocation}. Join us for a great time!`,
        date: randomDate,
        startTime,
        endTime,
        location: randomLocation,
        visibility: "public",
        category: randomCategory,
        attendingCount,
        friendsAttending: attendingCount > 20 ? ["friend1", "friend2"] : [],
        image: `https://source.unsplash.com/random/400x300?${randomCategory}`,
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

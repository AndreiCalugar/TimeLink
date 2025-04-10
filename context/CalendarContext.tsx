import React, { createContext, useContext, useState, useEffect } from "react";

// Define types for events
export type EventVisibility = "public" | "private" | "friends";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // format: 'YYYY-MM-DD'
  startTime?: string;
  endTime?: string;
  location?: string;
  visibility: EventVisibility;
  color?: string;
  isDeadTime?: boolean;
  createdBy?: string; // user ID of creator
  attendees?: string[]; // list of user IDs
}

// Define a custom event type for calendar changes
export interface CalendarChangeEvent {
  type: "create" | "update" | "delete";
  eventId: string;
  eventDate: string;
}

type CalendarContextType = {
  events: Record<string, CalendarEvent[]>;
  createEvent: (event: Omit<CalendarEvent, "id">) => Promise<string>; // Return the ID of the created event
  updateEvent: (id: string, event: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEventsByDate: (date: string) => CalendarEvent[];
  getEventById: (id: string) => CalendarEvent | undefined;
  // Add a new field for event listeners
  addEventListener: (
    callback: (event: CalendarChangeEvent) => void
  ) => () => void;
};

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<Record<string, CalendarEvent[]>>({});
  // Add a state for change listeners
  const [changeListeners, setChangeListeners] = useState<
    ((event: CalendarChangeEvent) => void)[]
  >([]);

  // Notify listeners of calendar changes
  const notifyListeners = (event: CalendarChangeEvent) => {
    changeListeners.forEach((listener) => listener(event));
  };

  // Add event listener function
  const addEventListener = (callback: (event: CalendarChangeEvent) => void) => {
    setChangeListeners((prev) => [...prev, callback]);

    // Return unsubscribe function
    return () => {
      setChangeListeners((prev) =>
        prev.filter((listener) => listener !== callback)
      );
    };
  };

  // Load initial mock data
  useEffect(() => {
    // Get current date
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Generate dates for this month
    const mockEvents: Record<string, CalendarEvent[]> = {};

    // Team meeting every Wednesday
    for (let i = 1; i <= 31; i++) {
      const date = new Date(currentYear, currentMonth, i);
      if (date.getDay() === 3) {
        // Wednesday
        const dateString = date.toISOString().split("T")[0];
        mockEvents[dateString] = [
          {
            id: `meeting-${dateString}`,
            title: "Team Meeting",
            description: "Weekly team sync",
            date: dateString,
            startTime: "10:00",
            endTime: "11:00",
            visibility: "public",
            color: "#4285F4",
          },
        ];
      }
    }

    // Add some personal events
    const today_string = today.toISOString().split("T")[0];
    if (!mockEvents[today_string]) {
      mockEvents[today_string] = [];
    }

    mockEvents[today_string].push({
      id: `lunch-${today_string}`,
      title: "Lunch with Alex",
      date: today_string,
      startTime: "12:30",
      endTime: "13:30",
      visibility: "friends",
      color: "#34A853",
    });

    // Add some dead time blocks
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrow_string = tomorrow.toISOString().split("T")[0];

    if (!mockEvents[tomorrow_string]) {
      mockEvents[tomorrow_string] = [];
    }

    mockEvents[tomorrow_string].push({
      id: `personal-${tomorrow_string}`,
      title: "Personal Time",
      date: tomorrow_string,
      startTime: "18:00",
      endTime: "20:00",
      visibility: "private",
      color: "#EA4335",
      isDeadTime: true,
    });

    setEvents(mockEvents);
  }, []);

  // Create a new event
  const createEvent = async (eventData: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Math.random().toString(36).substring(2, 9), // Simple ID generation
    };

    setEvents((prevEvents) => {
      const dateEvents = prevEvents[eventData.date] || [];
      return {
        ...prevEvents,
        [eventData.date]: [...dateEvents, newEvent],
      };
    });

    // Notify listeners of the new event
    notifyListeners({
      type: "create",
      eventId: newEvent.id,
      eventDate: eventData.date,
    });

    return newEvent.id; // Return the new event ID
  };

  // Update an existing event
  const updateEvent = async (id: string, eventData: Partial<CalendarEvent>) => {
    let updatedDate = "";

    setEvents((prevEvents) => {
      const newEvents = { ...prevEvents };

      // Find the event
      for (const date in newEvents) {
        const eventIndex = newEvents[date].findIndex((e) => e.id === id);
        if (eventIndex !== -1) {
          updatedDate = date;

          // Update the event
          const updatedEvent = {
            ...newEvents[date][eventIndex],
            ...eventData,
          };

          // If the date changed, move it to the new date
          if (eventData.date && eventData.date !== date) {
            // Remove from old date
            newEvents[date] = newEvents[date].filter((e) => e.id !== id);

            // Add to new date
            const newDateEvents = newEvents[eventData.date] || [];
            newEvents[eventData.date] = [...newDateEvents, updatedEvent];

            updatedDate = eventData.date;
          } else {
            // Update in the same date
            newEvents[date][eventIndex] = updatedEvent;
          }

          break;
        }
      }

      return newEvents;
    });

    // Notify listeners of the update
    if (updatedDate) {
      notifyListeners({
        type: "update",
        eventId: id,
        eventDate: updatedDate,
      });
    }
  };

  // Delete an event
  const deleteEvent = async (id: string) => {
    let deletedDate = "";

    setEvents((prevEvents) => {
      const newEvents = { ...prevEvents };

      // Find and remove the event
      for (const date in newEvents) {
        const filteredEvents = newEvents[date].filter((e) => e.id !== id);
        if (filteredEvents.length !== newEvents[date].length) {
          deletedDate = date;
          newEvents[date] = filteredEvents;
          break;
        }
      }

      return newEvents;
    });

    // Notify listeners of the deletion
    if (deletedDate) {
      notifyListeners({
        type: "delete",
        eventId: id,
        eventDate: deletedDate,
      });
    }
  };

  // Get events for a specific date
  const getEventsByDate = (date: string): CalendarEvent[] => {
    return events[date] || [];
  };

  // Get an event by its ID
  const getEventById = (id: string): CalendarEvent | undefined => {
    for (const date in events) {
      const event = events[date].find((e) => e.id === id);
      if (event) {
        return event;
      }
    }
    return undefined;
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        createEvent,
        updateEvent,
        deleteEvent,
        getEventsByDate,
        getEventById,
        addEventListener,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider"
    );
  }
  return context;
};

import React from "react";
import { render, act } from "@testing-library/react-native";
import { Text } from "react-native";
import {
  CalendarProvider,
  useCalendarContext,
} from "../../context/CalendarContext";

// Test component to access context
const TestComponent = () => {
  const {
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
    getEventById,
  } = useCalendarContext();

  return (
    <>
      <Text testID="event-count">{Object.keys(events).length}</Text>
      <Text testID="test-event">{JSON.stringify(getEventById("test-id"))}</Text>
      <Text testID="events-on-day">
        {JSON.stringify(getEventsByDate("2023-05-15"))}
      </Text>
    </>
  );
};

describe("CalendarContext", () => {
  it("initializes with default values", () => {
    const { getByTestId } = render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    // There should be some initial event data
    expect(parseInt(getByTestId("event-count").props.children)).toBeGreaterThan(
      0
    );
  });

  it("creates a new event correctly", async () => {
    const { getByTestId } = render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    // Get the initial count of events
    const initialCount = parseInt(getByTestId("event-count").props.children);

    // Get the context hooks directly from our test component
    const context = useCalendarContext();

    // Create a new event
    await act(async () => {
      await context.createEvent({
        title: "New Test Event",
        description: "This is a test event",
        date: "2023-05-15",
        startTime: "09:00",
        endTime: "10:00",
        visibility: "public",
      });
    });

    // Check if the count increased
    const newCount = parseInt(getByTestId("event-count").props.children);
    expect(newCount).toBe(initialCount); // The count won't change because we're adding to an existing date

    // Check if the event appears in the correct date
    const eventsOnDay = JSON.parse(getByTestId("events-on-day").props.children);
    const newEvent = eventsOnDay.find((e: any) => e.title === "New Test Event");
    expect(newEvent).toBeTruthy();
    expect(newEvent.description).toBe("This is a test event");
  });

  it("updates an event correctly", async () => {
    const { getByTestId } = render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    const context = useCalendarContext();

    // First create an event
    let eventId: string;
    await act(async () => {
      await context.createEvent({
        title: "Event to Update",
        description: "Original description",
        date: "2023-05-15",
        startTime: "14:00",
        endTime: "15:00",
        visibility: "public",
      });

      // Find the ID of the event we just created
      const eventsOnDay = context.getEventsByDate("2023-05-15");
      const eventToUpdate = eventsOnDay.find(
        (e) => e.title === "Event to Update"
      );
      eventId = eventToUpdate ? eventToUpdate.id : "";
    });

    // Now update the event
    await act(async () => {
      await context.updateEvent(eventId, {
        title: "Updated Event",
        description: "Updated description",
      });
    });

    // Verify the event was updated
    const eventsOnDay = JSON.parse(getByTestId("events-on-day").props.children);
    const updatedEvent = eventsOnDay.find((e: any) => e.id === eventId);

    expect(updatedEvent).toBeTruthy();
    expect(updatedEvent.title).toBe("Updated Event");
    expect(updatedEvent.description).toBe("Updated description");
  });

  it("deletes an event correctly", async () => {
    const { getByTestId } = render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    const context = useCalendarContext();

    // First create an event
    let eventId: string;
    await act(async () => {
      await context.createEvent({
        title: "Event to Delete",
        description: "This will be deleted",
        date: "2023-05-15",
        startTime: "16:00",
        endTime: "17:00",
        visibility: "public",
      });

      // Find the ID of the event we just created
      const eventsOnDay = context.getEventsByDate("2023-05-15");
      const eventToDelete = eventsOnDay.find(
        (e) => e.title === "Event to Delete"
      );
      eventId = eventToDelete ? eventToDelete.id : "";
    });

    // Get the count before deletion
    const initialEventsOnDay = JSON.parse(
      getByTestId("events-on-day").props.children
    );
    const initialCount = initialEventsOnDay.length;

    // Now delete the event
    await act(async () => {
      await context.deleteEvent(eventId);
    });

    // Verify the event was deleted
    const eventsOnDay = JSON.parse(getByTestId("events-on-day").props.children);
    const deletedEvent = eventsOnDay.find((e: any) => e.id === eventId);

    expect(deletedEvent).toBeUndefined();
    expect(eventsOnDay.length).toBe(initialCount - 1);
  });

  it("gets events by date correctly", async () => {
    const { getByTestId } = render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    const context = useCalendarContext();

    // Create events on different dates
    await act(async () => {
      await context.createEvent({
        title: "Event on Day 1",
        date: "2023-05-15",
        visibility: "public",
      });

      await context.createEvent({
        title: "Event on Day 2",
        date: "2023-05-16",
        visibility: "public",
      });
    });

    // Check if the events are retrieved correctly
    const eventsOnDay1 = context.getEventsByDate("2023-05-15");
    const eventsOnDay2 = context.getEventsByDate("2023-05-16");

    expect(eventsOnDay1.some((e) => e.title === "Event on Day 1")).toBeTruthy();
    expect(eventsOnDay2.some((e) => e.title === "Event on Day 2")).toBeTruthy();

    // Should not have day 2 events on day 1
    expect(eventsOnDay1.some((e) => e.title === "Event on Day 2")).toBeFalsy();
  });
});

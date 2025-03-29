import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import DateNavigator from "../../../components/calendar/DateNavigator";
import { format, addDays, addWeeks, subDays, subWeeks } from "date-fns";

// Mock the date-fns functions to control their return values
jest.mock("date-fns", () => {
  const actual = jest.requireActual("date-fns");
  return {
    ...actual,
    format: jest.fn().mockImplementation((date, formatStr) => {
      if (formatStr === "MMMM d, yyyy") return "May 15, 2023";
      if (formatStr === "MMM d") return "May 15";
      if (formatStr === "MMM d, yyyy") return "May 21, 2023";
      if (formatStr === "yyyy-MM-dd") return "2023-05-15";
      return formatStr;
    }),
    addDays: jest.fn().mockImplementation(() => new Date("2023-05-16")),
    subDays: jest.fn().mockImplementation(() => new Date("2023-05-14")),
    addWeeks: jest.fn().mockImplementation(() => new Date("2023-05-22")),
    subWeeks: jest.fn().mockImplementation(() => new Date("2023-05-08")),
  };
});

describe("DateNavigator Component", () => {
  const mockOnDateChange = jest.fn();
  const testDate = "2023-05-15";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly in day view mode", () => {
    const { getByText } = render(
      <DateNavigator
        date={testDate}
        viewType="day"
        onDateChange={mockOnDateChange}
      />
    );

    // Check if the formatted date is displayed
    expect(getByText("May 15, 2023")).toBeTruthy();

    // Verify that format was called with the right parameters
    expect(format).toHaveBeenCalledWith(expect.any(Date), "MMMM d, yyyy");
  });

  it("renders correctly in week view mode", () => {
    const { getByText } = render(
      <DateNavigator
        date={testDate}
        viewType="week"
        onDateChange={mockOnDateChange}
      />
    );

    // Check if the week range text is displayed
    expect(getByText("May 15 - May 21, 2023")).toBeTruthy();
  });

  it("navigates to previous day when left arrow is clicked in day view", () => {
    const { getByTestId } = render(
      <DateNavigator
        date={testDate}
        viewType="day"
        onDateChange={mockOnDateChange}
      />
    );

    // Find and click the left arrow button
    const leftArrow = getByTestId("icon-chevron-left");
    fireEvent.press(leftArrow);

    // Check if onDateChange was called with the correct date
    expect(mockOnDateChange).toHaveBeenCalledWith("2023-05-14");
    expect(subDays).toHaveBeenCalled();
  });

  it("navigates to next day when right arrow is clicked in day view", () => {
    const { getByTestId } = render(
      <DateNavigator
        date={testDate}
        viewType="day"
        onDateChange={mockOnDateChange}
      />
    );

    // Find and click the right arrow button
    const rightArrow = getByTestId("icon-chevron-right");
    fireEvent.press(rightArrow);

    // Check if onDateChange was called with the correct date
    expect(mockOnDateChange).toHaveBeenCalledWith("2023-05-16");
    expect(addDays).toHaveBeenCalled();
  });

  it("navigates to previous week when left arrow is clicked in week view", () => {
    const { getByTestId } = render(
      <DateNavigator
        date={testDate}
        viewType="week"
        onDateChange={mockOnDateChange}
      />
    );

    // Find and click the left arrow button
    const leftArrow = getByTestId("icon-chevron-left");
    fireEvent.press(leftArrow);

    // Check if onDateChange was called with the correct date
    expect(mockOnDateChange).toHaveBeenCalledWith("2023-05-08");
    expect(subWeeks).toHaveBeenCalled();
  });

  it("navigates to next week when right arrow is clicked in week view", () => {
    const { getByTestId } = render(
      <DateNavigator
        date={testDate}
        viewType="week"
        onDateChange={mockOnDateChange}
      />
    );

    // Find and click the right arrow button
    const rightArrow = getByTestId("icon-chevron-right");
    fireEvent.press(rightArrow);

    // Check if onDateChange was called with the correct date
    expect(mockOnDateChange).toHaveBeenCalledWith("2023-05-22");
    expect(addWeeks).toHaveBeenCalled();
  });

  it("navigates to today when the Today button is clicked", () => {
    // Mock the current date for consistent testing
    const originalDateNow = Date.now;
    Date.now = jest.fn(() => new Date("2023-05-20").getTime());

    const { getByText } = render(
      <DateNavigator
        date={testDate}
        viewType="day"
        onDateChange={mockOnDateChange}
      />
    );

    // Find and click the Today button
    const todayButton = getByText("Today");
    fireEvent.press(todayButton);

    // Check if onDateChange was called with today's date
    expect(mockOnDateChange).toHaveBeenCalledWith("2023-05-15");

    // Restore the original Date.now
    Date.now = originalDateNow;
  });
});

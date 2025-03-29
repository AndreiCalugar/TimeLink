# Testing Documentation for TimeLink

This directory contains automated tests for the TimeLink application.

## Test Structure

The tests are organized to mirror the application structure:

- `components/` - Tests for React components
- `context/` - Tests for Context API modules
- `screens/` - Tests for screen components
- `utils/` - Tests for utility functions

## Running Tests

### Running All Tests

To run all tests with watch mode:

```bash
npm test
```

### Running Specific Tests

To run only calendar-related tests:

```bash
npm run test:calendar
```

## Test Patterns

### Component Tests

Component tests verify that UI components render correctly and respond to user interactions as expected.

Example:

```tsx
import { render, fireEvent } from "@testing-library/react-native";
import MyComponent from "../path/to/MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText("Expected Text")).toBeTruthy();
  });

  it("responds to user interaction", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<MyComponent onPress={onPressMock} />);
    fireEvent.press(getByText("Press Me"));
    expect(onPressMock).toHaveBeenCalled();
  });
});
```

### Context Tests

Context tests verify that context providers manage state correctly.

### Screen Tests

Screen tests verify that screens integrate components correctly and manage navigation.

## Mocking Guidelines

### Mocking Context

Use the actual provider with simplified mock data:

```tsx
jest.mock("../../context/MyContext", () => {
  return {
    useMyContext: jest.fn(() => ({
      // Mock implementation
    })),
  };
});
```

### Mocking External Libraries

For libraries like `react-native-calendars`, create minimal mock implementations:

```tsx
jest.mock("react-native-calendars", () => {
  return {
    Calendar: ({ onDayPress }) => <View data-testid="calendar-mock" />,
  };
});
```

## Debugging Tests

To debug tests, you can use:

```tsx
console.log(prettyDOM(container)); // For printing the rendered component
```

Add the `debug()` statement from the render result:

```tsx
const { debug } = render(<MyComponent />);
debug();
```

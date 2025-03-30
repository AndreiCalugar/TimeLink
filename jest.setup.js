// Add React Native specific setup
import "@testing-library/jest-native/extend-expect";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock the expo-router and other dependencies
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: "Link",
}));

// Mock the react-native-paper theme
jest.mock("react-native-paper", () => {
  const actualReactNativePaper = jest.requireActual("react-native-paper");
  return {
    ...actualReactNativePaper,
    useTheme: () => ({
      colors: {
        primary: "#6200ee",
        background: "#f6f6f6",
        surface: "#ffffff",
        accent: "#03dac4",
        error: "#b00020",
        text: "#000000",
        onSurface: "#000000",
        disabled: "rgba(0, 0, 0, 0.26)",
        placeholder: "rgba(0, 0, 0, 0.54)",
        backdrop: "rgba(0, 0, 0, 0.5)",
        notification: "#f50057",
        primaryContainer: "#E8DEF8",
        onPrimary: "#ffffff",
        onPrimaryContainer: "#21005E",
        secondaryContainer: "#E8DEF8",
        onSecondaryContainer: "#1D192B",
        errorContainer: "#F9DEDC",
        onErrorContainer: "#410E0B",
        onSurfaceVariant: "#49454F",
        outline: "#79747E",
      },
      dark: false,
      roundness: 4,
      animation: {
        scale: 1,
      },
    }),
  };
});

// Mock CalendarContext
jest.mock("./context/CalendarContext", () => ({
  useCalendarContext: () => ({
    events: {},
    getEventsByDate: () => [],
    createEvent: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
    getEventById: jest.fn(),
  }),
}));

// Mock the MaterialCommunityIcons from @expo/vector-icons
jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    MaterialCommunityIcons: ({ name, size, color, style }) => (
      <View
        style={[{ width: size, height: size }, style]}
        testID={`icon-${name}`}
      />
    ),
  };
});

// Mock date-fns to avoid issues with timezone differences in tests
jest.mock("date-fns", () => {
  const actualDateFns = jest.requireActual("date-fns");
  return {
    ...actualDateFns,
    format: jest.fn((date, formatStr) => {
      if (formatStr === "yyyy-MM-dd") return "2023-05-15";
      if (formatStr === "MMMM d, yyyy") return "May 15, 2023";
      if (formatStr === "EEEE, MMMM d, yyyy") return "Monday, May 15, 2023";
      if (formatStr === "MMM d") return "May 15";
      if (formatStr === "MMM d, yyyy") return "May 15, 2023";
      if (formatStr === "EEE") return "Mon";
      if (formatStr === "d") return "15";
      if (formatStr === "h:mm a") return "10:00 AM";
      if (formatStr === "HH:mm") return "10:00";
      return "May 15, 2023";
    }),
    parse: jest.fn(() => new Date(2023, 4, 15)),
    addDays: jest.fn(() => new Date(2023, 4, 22)),
    addWeeks: jest.fn(() => new Date(2023, 4, 22)),
    subDays: jest.fn(() => new Date(2023, 4, 14)),
    subWeeks: jest.fn(() => new Date(2023, 4, 8)),
    startOfWeek: jest.fn(() => new Date(2023, 4, 14)),
    endOfWeek: jest.fn(() => new Date(2023, 4, 20)),
    eachDayOfInterval: jest.fn(() => [
      new Date(2023, 4, 14),
      new Date(2023, 4, 15),
      new Date(2023, 4, 16),
      new Date(2023, 4, 17),
      new Date(2023, 4, 18),
      new Date(2023, 4, 19),
      new Date(2023, 4, 20),
    ]),
  };
});

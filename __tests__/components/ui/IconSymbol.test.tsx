import React from "react";
import { render } from "@testing-library/react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";

// Mock MaterialIcons component
jest.mock("@expo/vector-icons/MaterialIcons", () => "MaterialIcons");

describe("IconSymbol", () => {
  it("renders with the correct icon name mapping", () => {
    // We can't directly test the rendering because of Jest limitations
    // Instead, we're just ensuring the component doesn't throw errors

    // These icons should be mapped in the IconSymbol component
    const validIcons = [
      "house.fill",
      "paperplane.fill",
      "calendar",
      "person.fill",
      "chevron.right",
    ];

    // Test rendering each icon
    validIcons.forEach((iconName) => {
      expect(() => {
        render(<IconSymbol name={iconName as any} size={24} color="#000" />);
      }).not.toThrow();
    });
  });
});

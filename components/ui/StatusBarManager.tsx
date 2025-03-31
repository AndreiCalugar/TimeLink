import React from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";

interface StatusBarManagerProps {
  styleOverride?: "auto" | "light" | "dark";
}

export default function StatusBarManager({
  styleOverride,
}: StatusBarManagerProps) {
  const colorScheme = useColorScheme();

  // If an override is provided, use it, otherwise determine based on color scheme
  const statusBarStyle =
    styleOverride || (colorScheme === "dark" ? "light" : "dark");

  return <StatusBar style={statusBarStyle} />;
}

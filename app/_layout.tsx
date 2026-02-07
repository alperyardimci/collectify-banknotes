import "../global.css";
import "@/i18n";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSQLiteContext, SQLiteProvider } from "expo-sqlite";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { COLORS } from "@/constants/theme";

function InitializeDatabase() {
  const db = useSQLiteContext();
  const initialize = useBanknoteStore((s) => s.initialize);
  const isLoaded = useBanknoteStore((s) => s.isLoaded);

  useEffect(() => {
    initialize(db);
  }, [db, initialize]);

  if (!isLoaded) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: "slide_from_right",
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="collectify.db">
        <InitializeDatabase />
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}

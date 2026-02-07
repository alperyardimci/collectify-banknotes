import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/constants/theme";
import type { ReactNode } from "react";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: ReactNode;
}

export function Header({ title, showBack = false, rightAction }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View className="h-14 flex-row items-center px-xl">
      {showBack ? (
        <Pressable
          onPress={handleBack}
          className="w-11 h-11 items-center justify-center -ml-2"
          accessibilityLabel="Back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </Pressable>
      ) : (
        <View className="w-11" />
      )}
      <Text
        className="flex-1 text-center text-h1 font-light text-text-primary"
        numberOfLines={1}
      >
        {title}
      </Text>
      {rightAction ? (
        <View className="w-11 h-11 items-center justify-center">
          {rightAction}
        </View>
      ) : (
        <View className="w-11" />
      )}
    </View>
  );
}

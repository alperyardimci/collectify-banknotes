import { useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ZoomableImage } from "@/components/ZoomableImage";
import { COLORS } from "@/constants/theme";

export default function PhotoViewerScreen() {
  const { uri, backUri } = useLocalSearchParams<{
    uri: string;
    backUri?: string;
  }>();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showingBack, setShowingBack] = useState(false);

  const currentUri = showingBack && backUri ? backUri : uri;

  if (!uri) return null;

  return (
    <View className="flex-1" style={{ backgroundColor: "#000" }}>
      {/* Close Button */}
      <Pressable
        onPress={() => router.back()}
        className="absolute z-10 w-10 h-10 items-center justify-center bg-surface/60 rounded-full"
        style={{ top: insets.top + 8, left: 16 }}
      >
        <Ionicons name="close" size={22} color={COLORS.textPrimary} />
      </Pressable>

      {/* Photo */}
      <ZoomableImage uri={currentUri!} />

      {/* Front/Back Toggle */}
      {backUri && (
        <View
          className="absolute flex-row items-center self-center bg-surface/80 rounded-full px-sm"
          style={{ bottom: insets.bottom + 24 }}
        >
          <Pressable
            onPress={() => setShowingBack(false)}
            className={`px-md py-sm rounded-full ${
              !showingBack ? "bg-accent" : ""
            }`}
          >
            <Text
              className={`text-caption ${
                !showingBack ? "text-background" : "text-text-secondary"
              }`}
            >
              {t("photoViewer.front")}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowingBack(true)}
            className={`px-md py-sm rounded-full ${
              showingBack ? "bg-accent" : ""
            }`}
          >
            <Text
              className={`text-caption ${
                showingBack ? "text-background" : "text-text-secondary"
              }`}
            >
              {t("photoViewer.back")}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

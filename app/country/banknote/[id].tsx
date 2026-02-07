import { useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { getCountry } from "@/constants/countries";
import { Header } from "@/components/Header";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { COLORS } from "@/constants/theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PHOTO_HEIGHT = SCREEN_WIDTH * 0.65;

export default function BanknoteDetailScreen() {
  const { id, countryCode } = useLocalSearchParams<{
    id: string;
    countryCode: string;
  }>();
  const { t } = useTranslation();
  const router = useRouter();
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const banknotes = useBanknoteStore((s) => s.banknotes);
  const deleteBanknote = useBanknoteStore((s) => s.deleteBanknote);

  const [showingBack, setShowingBack] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const banknote = useMemo(
    () => banknotes.find((b) => b.id === parseInt(id, 10)),
    [banknotes, id]
  );

  const country = getCountry(countryCode);

  if (!banknote || !country) return null;

  const yearDisplay = banknote.is_current
    ? `${banknote.year_start} - ${t("banknote.present")}`
    : banknote.year_end
      ? `${banknote.year_start} - ${banknote.year_end}`
      : `${banknote.year_start}`;

  const currentPhoto = showingBack && banknote.back_photo
    ? banknote.back_photo
    : banknote.front_photo;

  const togglePhoto = () => {
    if (!banknote.back_photo) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowingBack(!showingBack);
  };

  const handleDelete = () => {
    deleteBanknote(db, banknote.id, banknote.front_photo, banknote.back_photo);
    router.back();
  };

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(
      `/country/banknote/edit?banknoteId=${banknote.id}&countryCode=${countryCode}`
    );
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header
        title={`${banknote.denomination} ${banknote.currency}`}
        showBack
        rightAction={
          <Pressable
            onPress={handleEdit}
            accessibilityLabel={t("banknote.edit")}
            accessibilityRole="button"
          >
            <Ionicons name="create-outline" size={22} color={COLORS.accent} />
          </Pressable>
        }
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        {/* Photo */}
        <Pressable onPress={togglePhoto}>
          <Image
            source={{ uri: currentPhoto }}
            style={{ width: SCREEN_WIDTH, height: PHOTO_HEIGHT }}
            contentFit="cover"
          />
          {banknote.back_photo && (
            <View className="absolute bottom-3 right-3 bg-surface/80 rounded-md px-sm py-xs flex-row items-center">
              <Ionicons
                name="sync-outline"
                size={14}
                color={COLORS.textPrimary}
              />
              <Text className="text-caption text-text-primary ml-xs">
                {showingBack ? t("banknote.frontPhoto") : t("banknote.backPhoto")}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Info */}
        <View className="px-xl pt-lg">
          {/* Country */}
          <View className="flex-row items-center mb-md">
            <Text className="text-[24px] mr-sm">{country.flag}</Text>
            <Text className="text-h2 text-text-primary">
              {t(country.nameKey)}
            </Text>
          </View>

          {/* Denomination & Year */}
          <View className="bg-surface rounded-lg p-md mb-md">
            <View className="flex-row justify-between mb-sm">
              <Text className="text-caption text-text-secondary">
                {t("banknote.denomination")}
              </Text>
              <Text className="text-body text-text-primary">
                {banknote.denomination} {banknote.currency}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-caption text-text-secondary">
                {t("banknote.yearStart")}
              </Text>
              <Text className="text-body text-text-primary">
                {yearDisplay}
              </Text>
            </View>
          </View>

          {/* Notes */}
          {banknote.notes && (
            <View className="bg-surface rounded-lg p-md mb-md">
              <Text className="text-caption text-text-secondary mb-xs">
                {t("banknote.notes")}
              </Text>
              <Text className="text-body text-text-primary">
                {banknote.notes}
              </Text>
            </View>
          )}

          {/* Delete Button */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowDeleteDialog(true);
            }}
            className="flex-row items-center justify-center py-md mt-md"
            accessibilityLabel={t("banknote.delete")}
            accessibilityRole="button"
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
            <Text className="text-body text-danger ml-sm">
              {t("banknote.delete")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={showDeleteDialog}
        title={t("banknote.deleteTitle")}
        message={t("banknote.deleteMessage")}
        confirmLabel={t("banknote.deleteConfirm")}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        destructive
      />
    </View>
  );
}

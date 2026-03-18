import { useState, useMemo } from "react";
import { View, SectionList, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { getContinentById } from "@/constants/continents";
import { getCountriesByContinent, removeCustomCountry } from "@/constants/countries";
import { deleteCustomCountry } from "@/db/queries";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { Header } from "@/components/Header";
import { CountryListItem } from "@/components/CountryListItem";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { COLORS } from "@/constants/theme";

export default function ContinentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const countryStats = useBanknoteStore((s) => s.countryStats);
  const loadBanknotes = useBanknoteStore((s) => s.loadBanknotes);

  const [deleteCode, setDeleteCode] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const continent = getContinentById(id);
  const isOther = id === "other";
  const countries = useMemo(() => getCountriesByContinent(id), [id, refreshKey]);

  const sections = useMemo(() => {
    const collected = countries.filter((c) => (countryStats[c.code] || 0) > 0);
    const undiscovered = countries.filter(
      (c) => !countryStats[c.code] || countryStats[c.code] === 0
    );

    const result: { title: string; data: typeof countries }[] = [];
    if (collected.length > 0) {
      result.push({ title: t("continent.yourCollection"), data: collected });
    }
    if (undiscovered.length > 0) {
      result.push({ title: t("continent.undiscovered"), data: undiscovered });
    }
    return result;
  }, [countries, countryStats, t]);

  const handleDeleteCountry = () => {
    if (!deleteCode) return;
    deleteCustomCountry(db, deleteCode);
    removeCustomCountry(deleteCode);
    loadBanknotes(db);
    setDeleteCode(null);
    setRefreshKey((k) => k + 1);
  };

  if (!continent) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-xl" style={{ paddingTop: insets.top }}>
        <Header title={t("common.notFound")} showBack />
        <View className="flex-1 items-center justify-center">
          <Text className="text-h2 text-text-primary mb-sm">{t("common.notFound")}</Text>
          <Text className="text-body text-text-secondary text-center">{t("common.notFoundDescription")}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header title={t(continent.nameKey)} showBack />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.code}
        renderSectionHeader={({ section: { title } }) => (
          <View className="px-xl pt-lg pb-sm bg-background">
            <Text className="text-caption text-text-muted uppercase tracking-wider">
              {title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="px-xl mb-sm flex-row items-center">
            <View className="flex-1">
              <CountryListItem
                countryCode={item.code}
                onPress={() => router.push(`/country/${item.code}`)}
              />
            </View>
            {isOther && (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setDeleteCode(item.code);
                }}
                className="ml-sm w-9 h-9 items-center justify-center"
                accessibilityLabel={t("banknote.delete")}
              >
                <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
              </Pressable>
            )}
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            emoji={continent.emoji}
            title={t("continent.emptyTitle")}
            description={t("continent.emptyDescription")}
          />
        }
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      />

      <ConfirmDialog
        visible={!!deleteCode}
        title={t("quickAdd.deleteCountryTitle")}
        message={t("quickAdd.deleteCountryMessage")}
        confirmLabel={t("banknote.deleteConfirm")}
        onConfirm={handleDeleteCountry}
        onCancel={() => setDeleteCode(null)}
        destructive
      />
    </View>
  );
}

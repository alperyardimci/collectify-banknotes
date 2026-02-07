import { useMemo } from "react";
import { View, SectionList, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { getContinentById } from "@/constants/continents";
import { getCountriesByContinent } from "@/constants/countries";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { Header } from "@/components/Header";
import { CountryListItem } from "@/components/CountryListItem";
import { EmptyState } from "@/components/EmptyState";

export default function ContinentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const countryStats = useBanknoteStore((s) => s.countryStats);

  const continent = getContinentById(id);
  const countries = useMemo(() => getCountriesByContinent(id), [id]);

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
          <View className="px-xl mb-sm">
            <CountryListItem
              countryCode={item.code}
              onPress={() => router.push(`/country/${item.code}`)}
            />
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
    </View>
  );
}

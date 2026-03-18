import { useState, useMemo } from "react";
import { View, Text, TextInput, FlatList, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { CONTINENTS } from "@/constants/continents";
import { getCountry } from "@/constants/countries";
import { Header } from "@/components/Header";
import { EmptyState } from "@/components/EmptyState";
import { FlagIcon } from "@/components/FlagIcon";
import { COLORS } from "@/constants/theme";
import { searchBanknotes } from "@/utils/search";

export default function SearchScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const banknotes = useBanknoteStore((s) => s.banknotes);

  const [query, setQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState<string>();
  const [hasBackPhoto, setHasBackPhoto] = useState(false);

  const results = useMemo(
    () =>
      searchBanknotes(
        banknotes,
        query,
        { continentId: selectedContinent, hasBackPhoto: hasBackPhoto || undefined },
        t
      ),
    [banknotes, query, selectedContinent, hasBackPhoto, t]
  );

  const chips = [
    { id: undefined, label: t("search.all") },
    ...CONTINENTS.map((c) => ({ id: c.id, label: t(c.nameKey) })),
  ];

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header title={t("search.title")} showBack />

      {/* Search Bar */}
      <View className="px-xl mb-md">
        <View
          className="flex-row items-center bg-surface rounded-lg px-md h-12"
          style={{ borderWidth: 1, borderColor: COLORS.border }}
        >
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("search.placeholder")}
            placeholderTextColor={COLORS.textMuted}
            className="flex-1 ml-sm text-body text-text-primary"
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <View className="mb-md">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-xl gap-sm"
        >
          {chips.map((chip) => {
            const isActive = chip.id === selectedContinent;
            return (
              <Pressable
                key={chip.id ?? "all"}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedContinent(isActive ? undefined : chip.id);
                }}
                className={`px-md py-xs rounded-full ${
                  isActive ? "bg-accent" : "bg-surface"
                }`}
              >
                <Text
                  className={`text-caption ${
                    isActive ? "text-background" : "text-text-secondary"
                  }`}
                >
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setHasBackPhoto(!hasBackPhoto);
            }}
            className={`px-md py-xs rounded-full ${
              hasBackPhoto ? "bg-accent" : "bg-surface"
            }`}
          >
            <Text
              className={`text-caption ${
                hasBackPhoto ? "text-background" : "text-text-secondary"
              }`}
            >
              {t("search.hasPhoto")}
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Results Count */}
      {(query || selectedContinent || hasBackPhoto) && (
        <Text className="text-caption text-text-muted px-xl mb-sm">
          {t("search.resultsCount", { count: results.length })}
        </Text>
      )}

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="px-xl pb-lg"
        ListEmptyComponent={
          query || selectedContinent || hasBackPhoto ? (
            <EmptyState
              emoji={"\uD83D\uDD0D"}
              title={t("search.noResults")}
              description={t("search.noResultsDescription")}
            />
          ) : null
        }
        renderItem={({ item }) => {
          const country = getCountry(item.country_code);
          if (!country) return null;
          const yearDisplay = item.is_current
            ? `${item.year_start} - ${t("banknote.present")}`
            : item.year_end
              ? `${item.year_start} - ${item.year_end}`
              : `${item.year_start}`;

          return (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(
                  `/country/banknote/${item.id}?countryCode=${item.country_code}`
                );
              }}
              className="flex-row items-center bg-surface rounded-lg p-sm mb-sm"
            >
              <Image
                source={{ uri: item.front_photo }}
                style={{ width: 60, height: 40, borderRadius: 6 }}
                contentFit="cover"
              />
              <View className="flex-1 ml-md">
                <View className="flex-row items-center">
                  <View className="mr-xs">
                    <FlagIcon code={country.code} flag={country.flag} size={18} />
                  </View>
                  <Text className="text-body text-text-primary" numberOfLines={1}>
                    {t(country.nameKey)}
                  </Text>
                </View>
                <Text className="text-caption text-text-secondary">
                  {item.denomination} {item.currency} · {yearDisplay}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={COLORS.textMuted}
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

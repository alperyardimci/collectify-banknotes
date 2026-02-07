import { useMemo } from "react";
import { View, FlatList, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { getCountry } from "@/constants/countries";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { Header } from "@/components/Header";
import { BanknoteCard } from "@/components/BanknoteCard";
import { EmptyState } from "@/components/EmptyState";
import { FAB } from "@/components/FAB";

const SCREEN_WIDTH = Dimensions.get("window").width;
const NUM_COLUMNS = 2;

export default function CountryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const allBanknotes = useBanknoteStore((s) => s.banknotes);

  const country = getCountry(id);
  const banknotes = useMemo(
    () => allBanknotes.filter((b) => b.country_code === id),
    [id, allBanknotes]
  );

  if (!country) return null;

  const navigateToAdd = () => {
    router.push(`/country/banknote/add?countryCode=${id}`);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header title={`${country.flag} ${t(country.nameKey)}`} showBack />

      {banknotes.length === 0 ? (
        <EmptyState
          emoji={country.flag}
          title={t("country.emptyTitle")}
          description={t("country.emptyDescription")}
          ctaTitle={t("country.addFirst")}
          onCtaPress={navigateToAdd}
        />
      ) : (
        <FlatList
          data={banknotes}
          keyExtractor={(item) => item.id.toString()}
          numColumns={NUM_COLUMNS}
          columnWrapperClassName="px-xl gap-md mb-md"
          renderItem={({ item }) => (
            <BanknoteCard
              banknote={item}
              onPress={() =>
                router.push(`/country/banknote/${item.id}?countryCode=${id}`)
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: insets.bottom + 80 }}
        />
      )}

      {banknotes.length > 0 && <FAB onPress={navigateToAdd} />}
    </View>
  );
}

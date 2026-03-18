import { useState } from "react";
import { View, Text, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { GoldButton } from "@/components/GoldButton";
import { EmojiImage } from "@/components/EmojiImage";
import { COLORS } from "@/constants/theme";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { pickAndCompare, type CompareReport } from "@/utils/compare";

export default function CompareScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const banknotes = useBanknoteStore((s) => s.banknotes);

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CompareReport | null>(null);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const result = await pickAndCompare(banknotes, t);
      if (result) setReport(result);
    } catch (e: any) {
      if (e?.message === "invalid") {
        Alert.alert(t("common.error"), t("account.importInvalid"));
      } else {
        Alert.alert(t("common.error"), t("compare.error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header title={t("compare.title")} showBack />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-xl pb-lg"
        showsVerticalScrollIndicator={false}
      >
        {!report ? (
          <View className="items-center pt-xl">
            <View className="w-20 h-20 rounded-full bg-accent/15 items-center justify-center mb-lg">
              <Ionicons name="git-compare-outline" size={40} color={COLORS.accent} />
            </View>
            <Text className="text-h2 text-text-primary text-center mb-sm">
              {t("compare.title")}
            </Text>
            <Text className="text-body text-text-secondary text-center mb-xl">
              {t("compare.description")}
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color={COLORS.accent} />
            ) : (
              <View className="w-full">
                <GoldButton
                  title={t("compare.selectFile")}
                  onPress={handleCompare}
                />
              </View>
            )}
          </View>
        ) : (
          <>
            {/* Summary Cards */}
            <View className="flex-row gap-sm mb-lg">
              <View className="flex-1 bg-surface rounded-lg p-md items-center">
                <Text className="text-caption text-accent mb-xs">{t("compare.you")}</Text>
                <Text className="text-[28px] font-light text-text-primary">
                  {report.myTotal}
                </Text>
                <Text className="text-caption text-text-muted">
                  {t("compare.banknotes")}
                </Text>
                <Text className="text-[20px] font-light text-text-primary mt-sm">
                  {report.myCountries}
                </Text>
                <Text className="text-caption text-text-muted">
                  {t("compare.countries")}
                </Text>
              </View>
              <View className="flex-1 bg-surface rounded-lg p-md items-center">
                <Text className="text-caption text-accent mb-xs">{t("compare.them")}</Text>
                <Text className="text-[28px] font-light text-text-primary">
                  {report.theirTotal}
                </Text>
                <Text className="text-caption text-text-muted">
                  {t("compare.banknotes")}
                </Text>
                <Text className="text-[20px] font-light text-text-primary mt-sm">
                  {report.theirCountries}
                </Text>
                <Text className="text-caption text-text-muted">
                  {t("compare.countries")}
                </Text>
              </View>
            </View>

            {/* Continent Comparison */}
            <Text className="text-h3 text-text-primary mb-md">
              {t("compare.byContinent")}
            </Text>
            <View className="bg-surface rounded-lg p-md mb-lg">
              <View className="flex-row mb-sm pb-sm" style={{ borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                <Text className="flex-1 text-caption text-text-muted" />
                <Text className="w-16 text-caption text-accent text-center">{t("compare.you")}</Text>
                <Text className="w-16 text-caption text-text-secondary text-center">{t("compare.them")}</Text>
              </View>
              {report.continentComparison.map((item) => (
                <View key={item.nameKey} className="flex-row items-center mb-sm">
                  <View className="flex-1 flex-row items-center">
                    <EmojiImage emoji={item.emoji} size={16} />
                    <Text className="text-body text-text-primary ml-sm" numberOfLines={1}>
                      {t(item.nameKey)}
                    </Text>
                  </View>
                  <Text className={`w-16 text-body text-center ${item.myCount >= item.theirCount ? "text-accent" : "text-text-secondary"}`}>
                    {item.myCount}
                  </Text>
                  <Text className={`w-16 text-body text-center ${item.theirCount > item.myCount ? "text-accent" : "text-text-secondary"}`}>
                    {item.theirCount}
                  </Text>
                </View>
              ))}
            </View>

            {/* Common Countries */}
            {report.commonCountries.length > 0 && (
              <>
                <Text className="text-h3 text-text-primary mb-md">
                  {t("compare.commonCountries")} ({report.commonCountries.length})
                </Text>
                <View className="bg-surface rounded-lg p-md mb-lg">
                  <Text className="text-body text-text-secondary">
                    {report.commonCountries.join(", ")}
                  </Text>
                </View>
              </>
            )}

            {/* Only Mine */}
            {report.onlyMine.length > 0 && (
              <>
                <Text className="text-h3 text-text-primary mb-md">
                  {t("compare.onlyYou")} ({report.onlyMine.length})
                </Text>
                <View className="bg-surface rounded-lg p-md mb-lg" style={{ borderWidth: 1, borderColor: "rgba(76, 175, 130, 0.3)" }}>
                  <Text className="text-body text-success">
                    {report.onlyMine.join(", ")}
                  </Text>
                </View>
              </>
            )}

            {/* Only Theirs */}
            {report.onlyTheirs.length > 0 && (
              <>
                <Text className="text-h3 text-text-primary mb-md">
                  {t("compare.onlyThem")} ({report.onlyTheirs.length})
                </Text>
                <View className="bg-surface rounded-lg p-md mb-lg" style={{ borderWidth: 1, borderColor: "rgba(212, 168, 67, 0.3)" }}>
                  <Text className="text-body text-accent">
                    {report.onlyTheirs.join(", ")}
                  </Text>
                </View>
              </>
            )}

            {/* Unique Banknotes - Mine */}
            {report.myUniqueNotes.length > 0 && (
              <>
                <Text className="text-h3 text-text-primary mb-md">
                  {t("compare.uniqueYours")}
                </Text>
                <View className="bg-surface rounded-lg p-md mb-lg">
                  {report.myUniqueNotes.map((note, i) => (
                    <View key={i} className="flex-row justify-between mb-xs">
                      <Text className="text-body text-text-primary flex-1" numberOfLines={1}>
                        {note.country}
                      </Text>
                      <Text className="text-caption text-success">
                        {note.denomination} {note.currency}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Unique Banknotes - Theirs */}
            {report.theirUniqueNotes.length > 0 && (
              <>
                <Text className="text-h3 text-text-primary mb-md">
                  {t("compare.uniqueTheirs")}
                </Text>
                <View className="bg-surface rounded-lg p-md mb-lg">
                  {report.theirUniqueNotes.map((note, i) => (
                    <View key={i} className="flex-row justify-between mb-xs">
                      <Text className="text-body text-text-primary flex-1" numberOfLines={1}>
                        {note.country}
                      </Text>
                      <Text className="text-caption text-accent">
                        {note.denomination} {note.currency}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Compare Again */}
            <GoldButton
              title={t("compare.compareAnother")}
              onPress={() => setReport(null)}
            />
          </>
        )}

        <View style={{ height: insets.bottom + 16 }} />
      </ScrollView>
    </View>
  );
}

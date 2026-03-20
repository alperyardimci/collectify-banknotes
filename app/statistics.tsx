import { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { ACHIEVEMENTS } from "@/constants/achievements";
import { Header } from "@/components/Header";
import { ExportOptionsSheet } from "@/components/ExportOptionsSheet";
import { COLORS } from "@/constants/theme";
import { FlagIcon } from "@/components/FlagIcon";
import { EmojiImage } from "@/components/EmojiImage";
import {
  getCollectionAge,
  getContinentDistribution,
  getTopDenominations,
  getRecentActivity,
  getSerialPrefixStats,
  formatRelativeTime,
  getCountryNameForBanknote,
} from "@/utils/statistics";
import { exportCSV, exportPDF, shareFile } from "@/utils/export";

export default function StatisticsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const banknotes = useBanknoteStore((s) => s.banknotes);
  const countryStats = useBanknoteStore((s) => s.countryStats);
  const unlockedAchievements = useBanknoteStore((s) => s.unlockedAchievements);

  const [showExport, setShowExport] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const collectionAge = getCollectionAge(banknotes);
  const continentDist = getContinentDistribution(banknotes, countryStats);
  const topDenoms = getTopDenominations(banknotes);
  const serialStats = getSerialPrefixStats(banknotes);
  const recent = getRecentActivity(banknotes);
  const maxContinentCount = Math.max(...continentDist.map((c) => c.count), 1);
  const uniqueCountries = Object.keys(countryStats).length;

  const handleExportCSV = async () => {
    setExportLoading(true);
    try {
      const path = await exportCSV(banknotes, t);
      setShowExport(false);
      await shareFile(path);
    } catch {
      Alert.alert(t("common.error"), t("export.error"));
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setExportLoading(true);
    try {
      const path = await exportPDF(banknotes, t);
      setShowExport(false);
      await shareFile(path);
    } catch {
      Alert.alert(t("common.error"), t("export.error"));
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header
        title={t("statistics.title")}
        showBack
        rightAction={
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowExport(true);
            }}
            accessibilityLabel={t("export.title")}
          >
            <Ionicons name="share-outline" size={22} color={COLORS.accent} />
          </Pressable>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-xl pb-lg"
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <View className="flex-row gap-sm mb-lg">
          <View className="flex-1 bg-surface rounded-lg p-md items-center">
            <Text className="text-[28px] font-light text-accent">
              {banknotes.length}
            </Text>
            <Text className="text-caption text-text-secondary">
              {t("statistics.totalBanknotes")}
            </Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-md items-center">
            <Text className="text-[28px] font-light text-accent">
              {uniqueCountries}
            </Text>
            <Text className="text-caption text-text-secondary">
              {t("statistics.totalCountries")}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-sm mb-lg">
          <View className="flex-1 bg-surface rounded-lg p-md items-center">
            <Text className="text-[28px] font-light text-accent">
              {collectionAge}
            </Text>
            <Text className="text-caption text-text-secondary">
              {t("statistics.collectionAge")}
            </Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-md items-center">
            <Text className="text-[28px] font-light text-accent">
              {unlockedAchievements.size}/{ACHIEVEMENTS.length}
            </Text>
            <Text className="text-caption text-text-secondary">
              {t("achievements.title")}
            </Text>
          </View>
        </View>

        {/* Continent Distribution */}
        <Text className="text-h3 text-text-primary mb-md">
          {t("statistics.continentDistribution")}
        </Text>
        <View className="bg-surface rounded-lg p-md mb-lg">
          {continentDist.filter((c) => c.continentId !== "other" || c.count > 0).map((item) => {
            const pct = item.total > 0 ? Math.round((item.collected / item.total) * 100) : 0;
            return (
              <View key={item.continentId} className="flex-row items-center mb-sm">
                <View className="w-8 items-center">
                  <EmojiImage emoji={item.emoji} size={18} />
                </View>
                <Text className="text-caption text-text-secondary w-20" numberOfLines={1}>
                  {t(item.nameKey)}
                </Text>
                <View className="flex-1 h-4 bg-surface-light rounded-full mx-sm overflow-hidden">
                  <View
                    className="h-full bg-accent rounded-full"
                    style={{
                      width: `${item.total > 0 ? Math.max(pct, item.collected > 0 ? 3 : 0) : 0}%`,
                    }}
                  />
                </View>
                <Text className="text-caption text-accent w-12 text-right">
                  {item.total > 0 ? `${pct}%` : item.count}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Top Denominations */}
        {topDenoms.length > 0 && (
          <>
            <Text className="text-h3 text-text-primary mb-md">
              {t("statistics.topDenominations")}
            </Text>
            <View className="bg-surface rounded-lg p-md mb-lg">
              {topDenoms.map((item, idx) => (
                <View
                  key={`${item.denomination}-${item.currency}`}
                  className="flex-row items-center justify-between mb-sm"
                >
                  <View className="flex-row items-center">
                    <Text className="text-caption text-text-muted w-6">
                      #{idx + 1}
                    </Text>
                    <Text className="text-body text-text-primary">
                      {item.denomination} {item.currency}
                    </Text>
                  </View>
                  <Text className="text-caption text-accent">
                    x{item.count}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Serial Number Stats */}
        {serialStats.length > 0 && (
          <>
            <Text className="text-h3 text-text-primary mb-md">
              {t("statistics.serialStats")}
            </Text>
            <View className="bg-surface rounded-lg p-md mb-lg">
              {serialStats.map((item, idx) => (
                <View
                  key={item.prefix}
                  className="flex-row items-center justify-between mb-sm"
                >
                  <View className="flex-row items-center">
                    <Text className="text-caption text-text-muted w-6">
                      #{idx + 1}
                    </Text>
                    <Text className="text-body text-text-primary">
                      {t("statistics.serialSeries", { letter: item.prefix })}
                    </Text>
                  </View>
                  <Text className="text-caption text-accent">
                    x{item.count}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Recent Activity */}
        {recent.length > 0 && (
          <>
            <Text className="text-h3 text-text-primary mb-md">
              {t("statistics.recentActivity")}
            </Text>
            <View className="bg-surface rounded-lg p-md mb-lg">
              {recent.map((item) => {
                const { name, flag } = getCountryNameForBanknote(
                  item.country_code,
                  t
                );
                return (
                  <View
                    key={item.id}
                    className="flex-row items-center justify-between mb-sm"
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="mr-sm">
                        <FlagIcon code={item.country_code} flag={flag} size={18} />
                      </View>
                      <Text
                        className="text-body text-text-primary flex-1"
                        numberOfLines={1}
                      >
                        {item.denomination} {item.currency}
                      </Text>
                    </View>
                    <Text className="text-caption text-text-muted">
                      {formatRelativeTime(item.created_at, t)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Achievements Overview */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/achievements");
          }}
        >
          <Text className="text-h3 text-text-primary mb-md">
            {t("statistics.achievementsOverview")}
          </Text>
          <View className="bg-surface rounded-lg p-md mb-lg">
            <View className="flex-row flex-wrap gap-md justify-center">
              {ACHIEVEMENTS.map((a) => (
                <View key={a.id} style={{ opacity: unlockedAchievements.has(a.id) ? 1 : 0.2 }}>
                  <EmojiImage emoji={a.emoji} size={28} />
                </View>
              ))}
            </View>
            <Text className="text-caption text-accent text-center mt-md">
              {t("achievements.viewAll")}
            </Text>
          </View>
        </Pressable>

        <View style={{ height: insets.bottom + 16 }} />
      </ScrollView>

      <ExportOptionsSheet
        visible={showExport}
        loading={exportLoading}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        onClose={() => setShowExport(false)}
      />
    </View>
  );
}

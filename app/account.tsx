import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { COLORS } from "@/constants/theme";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { changeLanguage } from "@/i18n";
import { exportBackup, importBackup } from "@/utils/backup";

export default function AccountScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const loadBanknotes = useBanknoteStore((s) => s.loadBanknotes);
  const banknotes = useBanknoteStore((s) => s.banknotes);

  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");

  const handleExportFile = async () => {
    setLoading(true);
    setSyncStatus("");
    try {
      await exportBackup(db, setSyncStatus);
    } catch (e: any) {
      if (e?.message !== "cancelled") {
        Alert.alert(t("common.error"), t("account.exportError"));
      }
    } finally {
      setLoading(false);
      setSyncStatus("");
    }
  };

  const handleImportFile = async () => {
    Alert.alert(
      t("account.importTitle"),
      t("account.importWarning"),
      [
        { text: t("banknote.cancel"), style: "cancel" },
        {
          text: t("account.importConfirm"),
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            setSyncStatus("");
            try {
              const { banknoteCount } = await importBackup(db, setSyncStatus);
              loadBanknotes(db);
              Alert.alert(
                t("account.importSuccess"),
                t("account.importSuccessMsg", { count: banknoteCount })
              );
            } catch (e: any) {
              if (e?.message === "cancelled") return;
              if (e?.message === "invalid") {
                Alert.alert(t("common.error"), t("account.importInvalid"));
              } else {
                Alert.alert(t("common.error"), t("account.importError"));
              }
            } finally {
              setLoading(false);
              setSyncStatus("");
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header title={t("account.title")} showBack />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-xl pb-lg"
        showsVerticalScrollIndicator={false}
      >
        {/* Loading Status */}
        {(loading || syncStatus) && (
          <View className="bg-surface rounded-lg p-md mb-lg items-center">
            <ActivityIndicator size="small" color={COLORS.accent} />
            {syncStatus ? (
              <Text className="text-caption text-text-secondary mt-sm">
                {syncStatus}
              </Text>
            ) : null}
          </View>
        )}

        {/* File Transfer */}
        <Text className="text-h3 text-text-primary mb-sm">
          {t("account.fileTransfer")}
        </Text>
        <Text className="text-caption text-text-muted mb-md">
          {t("account.fileTransferDesc")}
        </Text>

        <Pressable
          onPress={handleExportFile}
          disabled={loading}
          className="bg-surface rounded-lg p-md flex-row items-center mb-sm"
          style={{ borderWidth: 1, borderColor: COLORS.border }}
        >
          <View className="w-10 h-10 rounded-full bg-accent/10 items-center justify-center mr-md">
            <Ionicons name="download-outline" size={22} color={COLORS.accent} />
          </View>
          <View className="flex-1">
            <Text className="text-body text-text-primary">
              {t("account.exportFile")}
            </Text>
            <Text className="text-caption text-text-muted">
              {t("account.exportFileHint")}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={handleImportFile}
          disabled={loading}
          className="bg-surface rounded-lg p-md flex-row items-center mb-sm"
          style={{ borderWidth: 1, borderColor: COLORS.border }}
        >
          <View className="w-10 h-10 rounded-full bg-accent/10 items-center justify-center mr-md">
            <Ionicons name="push-outline" size={22} color={COLORS.accent} />
          </View>
          <View className="flex-1">
            <Text className="text-body text-text-primary">
              {t("account.importFile")}
            </Text>
            <Text className="text-caption text-text-muted">
              {t("account.importFileHint")}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/compare");
          }}
          className="bg-surface rounded-lg p-md flex-row items-center"
          style={{ borderWidth: 1, borderColor: COLORS.border }}
        >
          <View className="w-10 h-10 rounded-full bg-accent/10 items-center justify-center mr-md">
            <Ionicons name="git-compare-outline" size={22} color={COLORS.accent} />
          </View>
          <View className="flex-1">
            <Text className="text-body text-text-primary">
              {t("account.compare")}
            </Text>
            <Text className="text-caption text-text-muted">
              {t("compare.description")}
            </Text>
          </View>
        </Pressable>

        {/* Language */}
        <View className="mt-xl pt-lg" style={{ borderTopWidth: 1, borderTopColor: COLORS.border }}>
          <Text className="text-h3 text-text-primary mb-md">
            {t("common.language")}
          </Text>
          <View className="flex-row gap-sm">
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                changeLanguage("en");
              }}
              className={`flex-1 p-md rounded-lg items-center ${
                i18n.language === "en" ? "bg-accent/15" : "bg-surface"
              }`}
              style={
                i18n.language === "en"
                  ? { borderWidth: 1.5, borderColor: COLORS.accent }
                  : { borderWidth: 1, borderColor: COLORS.border }
              }
            >
              <Text className={`text-body ${i18n.language === "en" ? "text-accent" : "text-text-secondary"}`}>
                {t("common.english")}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                changeLanguage("tr");
              }}
              className={`flex-1 p-md rounded-lg items-center ${
                i18n.language === "tr" ? "bg-accent/15" : "bg-surface"
              }`}
              style={
                i18n.language === "tr"
                  ? { borderWidth: 1.5, borderColor: COLORS.accent }
                  : { borderWidth: 1, borderColor: COLORS.border }
              }
            >
              <Text className={`text-body ${i18n.language === "tr" ? "text-accent" : "text-text-secondary"}`}>
                {t("common.turkish")}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={{ height: insets.bottom + 16 }} />
      </ScrollView>
    </View>
  );
}

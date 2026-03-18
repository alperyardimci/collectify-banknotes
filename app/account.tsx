import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
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
import { type User } from "firebase/auth";
import { Header } from "@/components/Header";
import { GoldButton } from "@/components/GoldButton";
import { COLORS } from "@/constants/theme";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { changeLanguage } from "@/i18n";
import {
  signUp,
  signIn,
  signOut,
  onAuthChange,
} from "@/services/firebase";
import { syncUpload, syncDownload } from "@/services/sync";
import { exportBackup, importBackup } from "@/utils/backup";

export default function AccountScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const loadBanknotes = useBanknoteStore((s) => s.loadBanknotes);
  const banknotes = useBanknoteStore((s) => s.banknotes);

  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t("common.error"), t("account.fillFields"));
      return;
    }
    if (password.length < 6) {
      Alert.alert(t("common.error"), t("account.passwordShort"));
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
    } catch (e: any) {
      const msg = e?.code === "auth/user-not-found"
        ? t("account.userNotFound")
        : e?.code === "auth/wrong-password"
          ? t("account.wrongPassword")
          : e?.code === "auth/email-already-in-use"
            ? t("account.emailInUse")
            : e?.code === "auth/invalid-email"
              ? t("account.invalidEmail")
              : t("account.authError");
      Alert.alert(t("common.error"), msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      Alert.alert(t("common.error"), t("account.authError"));
    }
  };

  const handleBackup = async () => {
    if (!user) return;
    setLoading(true);
    setSyncStatus("");
    try {
      await syncUpload(db, user.uid, setSyncStatus);
      Alert.alert(t("account.backupSuccess"), t("account.backupSuccessMsg", { count: banknotes.length }));
    } catch (e) {
      Alert.alert(t("common.error"), t("account.syncError"));
    } finally {
      setLoading(false);
      setSyncStatus("");
    }
  };

  const handleRestore = async () => {
    if (!user) return;

    Alert.alert(
      t("account.restoreTitle"),
      t("account.restoreWarning"),
      [
        { text: t("banknote.cancel"), style: "cancel" },
        {
          text: t("account.restoreConfirm"),
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            setSyncStatus("");
            try {
              const { banknoteCount } = await syncDownload(db, user.uid, setSyncStatus);
              loadBanknotes(db);
              Alert.alert(t("account.restoreSuccess"), t("account.restoreSuccessMsg", { count: banknoteCount }));
            } catch (e) {
              Alert.alert(t("common.error"), t("account.syncError"));
            } finally {
              setLoading(false);
              setSyncStatus("");
            }
          },
        },
      ]
    );
  };

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

  if (authLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header title={t("account.title")} showBack />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-xl pb-lg"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {user ? (
          /* Logged in */
          <>
            {/* User Info */}
            <View className="bg-surface rounded-lg p-md mb-lg items-center">
              <View className="w-16 h-16 rounded-full bg-accent/15 items-center justify-center mb-md">
                <Ionicons name="person" size={32} color={COLORS.accent} />
              </View>
              <Text className="text-h3 text-text-primary">{user.email}</Text>
              <Text className="text-caption text-text-muted mt-xs">
                {t("account.loggedIn")}
              </Text>
            </View>

            {/* Sync Status */}
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

            {/* Backup */}
            <View className="mb-md">
              <GoldButton
                title={t("account.backup")}
                onPress={handleBackup}
                loading={loading}
              />
            </View>
            <Text className="text-caption text-text-muted text-center mb-lg">
              {t("account.backupHint", { count: banknotes.length })}
            </Text>

            {/* Restore */}
            <Pressable
              onPress={handleRestore}
              disabled={loading}
              className="bg-surface rounded-lg p-md flex-row items-center mb-lg"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
            >
              <View className="w-10 h-10 rounded-full bg-accent/10 items-center justify-center mr-md">
                <Ionicons name="cloud-download-outline" size={22} color={COLORS.accent} />
              </View>
              <View className="flex-1">
                <Text className="text-body text-text-primary">
                  {t("account.restore")}
                </Text>
                <Text className="text-caption text-text-muted">
                  {t("account.restoreHint")}
                </Text>
              </View>
            </Pressable>

            {/* Sign Out */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleSignOut();
              }}
              className="flex-row items-center justify-center py-md mt-md"
            >
              <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
              <Text className="text-body text-danger ml-sm">
                {t("account.signOut")}
              </Text>
            </Pressable>
          </>
        ) : (
          /* Not logged in */
          <>
            <View className="items-center mb-xl">
              <View className="w-20 h-20 rounded-full bg-accent/15 items-center justify-center mb-md">
                <Ionicons name="cloud-outline" size={40} color={COLORS.accent} />
              </View>
              <Text className="text-h2 text-text-primary text-center">
                {t("account.welcome")}
              </Text>
              <Text className="text-body text-text-secondary text-center mt-sm">
                {t("account.welcomeDesc")}
              </Text>
            </View>

            {/* Email */}
            <View className="mb-md">
              <Text className="text-caption text-text-secondary mb-xs">
                {t("account.email")}
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={t("account.emailPlaceholder")}
                placeholderTextColor={COLORS.textMuted}
                className="h-12 bg-surface rounded-md px-md text-text-primary text-body"
                style={{ borderWidth: 1, borderColor: COLORS.border }}
              />
            </View>

            {/* Password */}
            <View className="mb-lg">
              <Text className="text-caption text-text-secondary mb-xs">
                {t("account.password")}
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder={t("account.passwordPlaceholder")}
                placeholderTextColor={COLORS.textMuted}
                className="h-12 bg-surface rounded-md px-md text-text-primary text-body"
                style={{ borderWidth: 1, borderColor: COLORS.border }}
              />
            </View>

            <GoldButton
              title={isSignUp ? t("account.signUp") : t("account.signIn")}
              onPress={handleAuth}
              loading={loading}
            />

            <Pressable
              onPress={() => setIsSignUp(!isSignUp)}
              className="items-center mt-lg"
            >
              <Text className="text-body text-accent">
                {isSignUp ? t("account.hasAccount") : t("account.noAccount")}
              </Text>
            </Pressable>
          </>
        )}

        {/* File Export/Import - always visible */}
        <View className="mt-xl pt-lg" style={{ borderTopWidth: 1, borderTopColor: COLORS.border }}>
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
            className="bg-surface rounded-lg p-md flex-row items-center"
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
            className="bg-surface rounded-lg p-md flex-row items-center mt-sm"
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
        </View>

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

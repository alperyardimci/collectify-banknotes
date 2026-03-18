import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { EmojiImage } from "@/components/EmojiImage";
import { GoldButton } from "@/components/GoldButton";
import { COLORS } from "@/constants/theme";
import {
  getAllCountriesList,
  registerCustomCountry,
  type Country,
} from "@/constants/countries";
import { insertCustomCountry } from "@/db/queries";

export default function QuickAddScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();

  const [query, setQuery] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customCurrency, setCustomCurrency] = useState("");

  const allCountries = useMemo(() => getAllCountriesList(), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allCountries;
    const q = query.toLowerCase().trim();
    return allCountries.filter((c) => {
      const name = t(c.nameKey).toLowerCase();
      const code = c.code.toLowerCase();
      const currency = c.currency.toLowerCase();
      return name.includes(q) || code.includes(q) || currency.includes(q);
    });
  }, [allCountries, query, t]);

  const handleSelectCountry = (country: Country) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace(`/country/banknote/add?countryCode=${country.code}`);
  };

  const handleAddCustom = () => {
    if (!customName.trim()) {
      Alert.alert(t("common.error"), t("quickAdd.nameRequired"));
      return;
    }
    if (!customCurrency.trim()) {
      Alert.alert(t("common.error"), t("quickAdd.currencyRequired"));
      return;
    }

    const code = `X_${customName.trim().toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4)}_${Date.now().toString(36).slice(-4)}`;
    const currency = customCurrency.trim().toUpperCase();

    insertCustomCountry(db, {
      code,
      name: customName.trim(),
      currency,
    });
    registerCustomCountry(code, customName.trim(), "\uD83C\uDFF3\uFE0F", currency);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace(`/country/banknote/add?countryCode=${code}`);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header title={t("quickAdd.title")} showBack />

      {!showCustomForm ? (
        <>
          {/* Search */}
          <View className="px-xl mb-md">
            <View
              className="flex-row items-center bg-surface rounded-lg px-md h-12"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
            >
              <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={t("quickAdd.searchPlaceholder")}
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

          {/* Custom Country Button */}
          <View className="px-xl mb-md">
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowCustomForm(true);
              }}
              className="flex-row items-center bg-surface rounded-lg p-md"
              style={{ borderWidth: 1, borderColor: COLORS.accent, borderStyle: "dashed" }}
            >
              <View className="w-10 h-10 rounded-full bg-accent/15 items-center justify-center mr-md">
                <Ionicons name="add" size={22} color={COLORS.accent} />
              </View>
              <View className="flex-1">
                <Text className="text-body text-accent">{t("quickAdd.customCountry")}</Text>
                <Text className="text-caption text-text-muted">{t("quickAdd.customCountryHint")}</Text>
              </View>
            </Pressable>
          </View>

          {/* Country List */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code}
            contentContainerClassName="px-xl pb-lg"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectCountry(item)}
                className="flex-row items-center bg-surface rounded-md p-sm mb-sm active:bg-surface-light"
              >
                <View className="mr-sm">
                  <EmojiImage emoji={item.flag} size={24} />
                </View>
                <View className="flex-1">
                  <Text className="text-body text-text-primary">{t(item.nameKey)}</Text>
                  <Text className="text-caption text-text-secondary">{item.currency}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
              </Pressable>
            )}
          />
        </>
      ) : (
        /* Custom Country Form */
        <KeyboardAvoidingView
          className="flex-1 px-xl"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text className="text-h3 text-text-primary mb-lg">
            {t("quickAdd.customCountry")}
          </Text>

          <View className="mb-lg">
            <Text className="text-caption text-text-secondary mb-xs">
              {t("quickAdd.countryName")} <Text className="text-danger">*</Text>
            </Text>
            <TextInput
              value={customName}
              onChangeText={setCustomName}
              placeholder={t("quickAdd.countryNamePlaceholder")}
              placeholderTextColor={COLORS.textMuted}
              className="h-12 bg-surface rounded-md px-md text-text-primary text-body"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
              autoFocus
            />
          </View>

          <View className="mb-lg">
            <Text className="text-caption text-text-secondary mb-xs">
              {t("quickAdd.currencyCode")} <Text className="text-danger">*</Text>
            </Text>
            <TextInput
              value={customCurrency}
              onChangeText={setCustomCurrency}
              placeholder={t("quickAdd.currencyCodePlaceholder")}
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="characters"
              maxLength={5}
              className="h-12 bg-surface rounded-md px-md text-text-primary text-body"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
            />
          </View>

          <GoldButton title={t("quickAdd.continue")} onPress={handleAddCustom} />

          <Pressable
            onPress={() => setShowCustomForm(false)}
            className="items-center mt-lg"
          >
            <Text className="text-body text-text-secondary">{t("quickAdd.backToList")}</Text>
          </Pressable>
        </KeyboardAvoidingView>
      )}

      <View style={{ height: insets.bottom + 16 }} />
    </View>
  );
}

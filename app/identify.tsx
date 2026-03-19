import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  FlatList,
  TextInput,
  ActionSheetIOS,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { COLORS } from "@/constants/theme";
import { SCRIPT_GROUPS, type ScriptGroup } from "@/constants/scripts";

type Step = "photo" | "script" | "country" | "denomination";

export default function IdentifyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<Step>("photo");
  const [photoUri, setPhotoUri] = useState<string>();
  const [selectedScript, setSelectedScript] = useState<ScriptGroup | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{
    code: string;
    name: string;
    currency: string;
    currencyName: string;
  } | null>(null);
  const [denomination, setDenomination] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  const pickPhoto = async (useCamera: boolean) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        t("common.permissionDenied"),
        useCamera ? t("common.cameraPermission") : t("common.galleryPermission")
      );
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: false })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: false });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setStep("script");
    }
  };

  const showPhotoPicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t("banknote.cancel"), t("banknote.camera"), t("banknote.gallery")],
          cancelButtonIndex: 0,
        },
        (index) => {
          if (index === 1) pickPhoto(true);
          if (index === 2) pickPhoto(false);
        }
      );
    } else {
      Alert.alert(t("identify.choosePhoto"), undefined, [
        { text: t("banknote.camera"), onPress: () => pickPhoto(true) },
        { text: t("banknote.gallery"), onPress: () => pickPhoto(false) },
        { text: t("banknote.cancel"), style: "cancel" },
      ]);
    }
  };

  const handleSelectScript = (group: ScriptGroup) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedScript(group);
    setStep("country");
  };

  const handleSelectCountry = (country: ScriptGroup["countries"][0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCountry(country);
    setStep("denomination");
  };

  const handleFinish = () => {
    if (!selectedCountry) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace(
      `/country/banknote/add?countryCode=${selectedCountry.code}&denomination=${denomination}&currency=${selectedCountry.currency}&photoUri=${encodeURIComponent(photoUri || "")}`
    );
  };

  const handleBack = () => {
    if (step === "denomination") setStep("country");
    else if (step === "country") setStep("script");
    else if (step === "script") setStep("photo");
    else router.back();
  };

  const stepNumber = step === "photo" ? 1 : step === "script" ? 2 : step === "country" ? 3 : 4;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header title={t("identify.title")} showBack onBack={handleBack} />

      {/* Progress */}
      <View className="flex-row px-xl mb-md gap-xs">
        {[1, 2, 3, 4].map((s) => (
          <View
            key={s}
            className="flex-1 h-1 rounded-full"
            style={{ backgroundColor: s <= stepNumber ? COLORS.accent : COLORS.border }}
          />
        ))}
      </View>

      {/* Step 1: Photo */}
      {step === "photo" && (
        <View className="flex-1 px-xl items-center justify-center">
          <View className="w-20 h-20 rounded-full bg-accent/15 items-center justify-center mb-lg">
            <Ionicons name="camera-outline" size={40} color={COLORS.accent} />
          </View>
          <Text className="text-h2 text-text-primary text-center mb-sm">
            {t("identify.step1Title")}
          </Text>
          <Text className="text-body text-text-secondary text-center mb-xl">
            {t("identify.step1Desc")}
          </Text>
          <Pressable
            onPress={showPhotoPicker}
            className="w-full bg-accent rounded-lg py-md items-center"
          >
            <Text className="text-h3 text-background">{t("identify.takePhoto")}</Text>
          </Pressable>
        </View>
      )}

      {/* Step 2: Select Script */}
      {step === "script" && (
        <View className="flex-1">
          {photoUri && (
            <Image
              source={{ uri: photoUri }}
              style={{ width: "100%", height: 140, marginBottom: 12 }}
              contentFit="cover"
            />
          )}
          <Text className="text-h3 text-text-primary px-xl mb-md">
            {t("identify.step2Title")}
          </Text>
          <ScrollView contentContainerClassName="px-xl pb-lg">
            {SCRIPT_GROUPS.map((group) => (
              <Pressable
                key={group.id}
                onPress={() => handleSelectScript(group)}
                className="flex-row items-center bg-surface rounded-lg p-md mb-sm active:bg-surface-light"
              >
                <View className="w-10 h-10 rounded-full bg-accent/10 items-center justify-center mr-md">
                  <Ionicons name={group.icon as any} size={20} color={COLORS.accent} />
                </View>
                <View className="flex-1">
                  <Text className="text-body text-text-primary">
                    {t(group.nameKey)}
                  </Text>
                  <Text className="text-caption text-text-muted">
                    {group.countries.length} {t("identify.countries")}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Step 3: Select Country */}
      {step === "country" && selectedScript && (
        <View className="flex-1">
          {photoUri && (
            <Image
              source={{ uri: photoUri }}
              style={{ width: "100%", height: 100, marginBottom: 8 }}
              contentFit="cover"
            />
          )}
          <Text className="text-h3 text-text-primary px-xl mb-sm">
            {t("identify.step3Title")}
          </Text>
          <Text className="text-caption text-text-muted px-xl mb-md">
            {t("identify.step3Hint")}
          </Text>

          {/* Country search within group */}
          <View className="px-xl mb-md">
            <View
              className="flex-row items-center bg-surface rounded-lg px-md h-10"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
            >
              <Ionicons name="search-outline" size={16} color={COLORS.textMuted} />
              <TextInput
                value={countrySearch}
                onChangeText={setCountrySearch}
                placeholder={t("identify.searchCountryOrFigure")}
                placeholderTextColor={COLORS.textMuted}
                className="flex-1 ml-sm text-body text-text-primary"
                returnKeyType="search"
              />
            </View>
          </View>

          <FlatList
            data={selectedScript.countries.filter((c) => {
              if (!countrySearch.trim()) return true;
              const q = countrySearch.toLowerCase();
              return (
                c.name.toLowerCase().includes(q) ||
                c.currency.toLowerCase().includes(q) ||
                c.currencyName.toLowerCase().includes(q) ||
                (c.figures || "").toLowerCase().includes(q)
              );
            })}
            keyExtractor={(item) => `${item.code}-${item.currency}`}
            contentContainerClassName="px-xl pb-lg"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectCountry(item)}
                className="bg-surface rounded-md p-sm mb-sm active:bg-surface-light"
              >
                <View className="flex-row items-center">
                  <View className="flex-1">
                    <Text className="text-body text-text-primary">{item.name}</Text>
                    <Text className="text-caption text-text-secondary">
                      {item.currency} — {item.currencyName}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                </View>
                {item.figures && (
                  <Text className="text-[11px] text-text-muted mt-xs" numberOfLines={2}>
                    {item.figures}
                  </Text>
                )}
              </Pressable>
            )}
          />
        </View>
      )}

      {/* Step 4: Denomination */}
      {step === "denomination" && selectedCountry && (
        <View className="flex-1 px-xl">
          {photoUri && (
            <Image
              source={{ uri: photoUri }}
              style={{ width: "100%", height: 160, borderRadius: 12, marginBottom: 16 }}
              contentFit="cover"
            />
          )}

          <View className="bg-surface rounded-lg p-md mb-lg">
            <Text className="text-caption text-text-muted mb-xs">{t("identify.selectedCountry")}</Text>
            <Text className="text-h2 text-text-primary">{selectedCountry.name}</Text>
            <Text className="text-body text-accent">{selectedCountry.currency} — {selectedCountry.currencyName}</Text>
          </View>

          <Text className="text-caption text-text-secondary mb-xs">
            {t("identify.enterDenomination")}
          </Text>
          <TextInput
            value={denomination}
            onChangeText={setDenomination}
            keyboardType="number-pad"
            placeholder={t("identify.denominationPlaceholder")}
            placeholderTextColor={COLORS.textMuted}
            className="h-12 bg-surface rounded-md px-md text-text-primary text-body mb-lg"
            style={{ borderWidth: 1, borderColor: COLORS.border }}
            autoFocus
          />

          <Pressable
            onPress={handleFinish}
            className="w-full bg-accent rounded-lg py-md items-center"
          >
            <Text className="text-h3 text-background">{t("identify.addToCollection")}</Text>
          </Pressable>
        </View>
      )}

      <View style={{ height: insets.bottom + 16 }} />
    </View>
  );
}

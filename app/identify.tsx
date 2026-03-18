import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  ActionSheetIOS,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { GoldButton } from "@/components/GoldButton";
import { COLORS } from "@/constants/theme";
import { getCountry } from "@/constants/countries";
import { EmojiImage } from "@/components/EmojiImage";
import {
  identifyBanknote,
  type BanknoteIdentification,
} from "@/utils/identify";

export default function IdentifyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [photoUri, setPhotoUri] = useState<string>();
  const [identifying, setIdentifying] = useState(false);
  const [result, setResult] = useState<BanknoteIdentification | null>(null);
  const [error, setError] = useState<string>();

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

    const pickerResult = useCamera
      ? await ImagePicker.launchCameraAsync({
          quality: 0.8,
          allowsEditing: false,
        })
      : await ImagePicker.launchImageLibraryAsync({
          quality: 0.8,
          allowsEditing: false,
        });

    if (!pickerResult.canceled && pickerResult.assets[0]) {
      setPhotoUri(pickerResult.assets[0].uri);
      setResult(null);
      setError(undefined);
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

  const handleIdentify = async () => {
    if (!photoUri) return;
    setIdentifying(true);
    setError(undefined);
    setResult(null);

    try {
      const identification = await identifyBanknote(photoUri);
      if (identification) {
        setResult(identification);
      } else {
        setError(t("identify.cannotIdentify"));
      }
    } catch (e) {
      setError(t("identify.error"));
    } finally {
      setIdentifying(false);
    }
  };

  const handleUseResult = () => {
    if (!result) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace(
      `/country/banknote/add?countryCode=${result.countryCode}&denomination=${result.denomination}&currency=${result.currency}&yearStart=${result.yearStart || ""}&yearEnd=${result.yearEnd || ""}&isCurrent=${result.isCurrent ? "1" : "0"}&photoUri=${encodeURIComponent(photoUri!)}&notes=${encodeURIComponent(result.notes || "")}`
    );
  };

  const country = result ? getCountry(result.countryCode) : null;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header title={t("identify.title")} showBack />

      <View className="flex-1 px-xl">
        {/* Photo Area */}
        {photoUri ? (
          <Pressable onPress={showPhotoPicker} className="mb-lg">
            <Image
              source={{ uri: photoUri }}
              style={{ width: "100%", height: 220, borderRadius: 12 }}
              contentFit="cover"
            />
            <View className="absolute bottom-2 right-2 bg-surface/80 rounded-md px-sm py-xs flex-row items-center">
              <Ionicons name="camera-outline" size={14} color={COLORS.textPrimary} />
              <Text className="text-caption text-text-primary ml-xs">
                {t("banknote.changePhoto")}
              </Text>
            </View>
          </Pressable>
        ) : (
          <Pressable
            onPress={showPhotoPicker}
            className="mb-lg items-center justify-center bg-surface rounded-lg"
            style={{
              height: 220,
              borderWidth: 2,
              borderColor: COLORS.border,
              borderStyle: "dashed",
            }}
          >
            <Ionicons name="camera-outline" size={48} color={COLORS.textMuted} />
            <Text className="text-body text-text-secondary mt-md">
              {t("identify.takePhoto")}
            </Text>
            <Text className="text-caption text-text-muted mt-xs">
              {t("identify.takePhotoHint")}
            </Text>
          </Pressable>
        )}

        {/* Identify Button */}
        {photoUri && !result && !identifying && (
          <GoldButton
            title={t("identify.identifyButton")}
            onPress={handleIdentify}
          />
        )}

        {/* Loading */}
        {identifying && (
          <View className="items-center py-xl">
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text className="text-body text-text-secondary mt-md">
              {t("identify.analyzing")}
            </Text>
          </View>
        )}

        {/* Error */}
        {error && (
          <View className="bg-surface rounded-lg p-md items-center mb-lg">
            <Ionicons name="alert-circle-outline" size={32} color={COLORS.danger} />
            <Text className="text-body text-danger mt-sm text-center">{error}</Text>
            <Pressable onPress={handleIdentify} className="mt-md">
              <Text className="text-body text-accent">{t("identify.tryAgain")}</Text>
            </Pressable>
          </View>
        )}

        {/* Result */}
        {result && country && (
          <View className="mt-lg">
            <View className="bg-surface rounded-lg p-md mb-md">
              <View className="flex-row items-center mb-md">
                <EmojiImage emoji={country.flag} size={28} />
                <View className="ml-md flex-1">
                  <Text className="text-h2 text-text-primary">
                    {t(country.nameKey)}
                  </Text>
                  <Text className="text-caption text-text-secondary">
                    {result.countryCode}
                  </Text>
                </View>
                <View
                  className="px-sm py-xs rounded-full"
                  style={{
                    backgroundColor:
                      result.confidence === "high"
                        ? "rgba(76, 175, 130, 0.15)"
                        : result.confidence === "medium"
                          ? "rgba(212, 168, 67, 0.15)"
                          : "rgba(232, 93, 93, 0.15)",
                  }}
                >
                  <Text
                    className="text-caption"
                    style={{
                      color:
                        result.confidence === "high"
                          ? COLORS.success
                          : result.confidence === "medium"
                            ? COLORS.accent
                            : COLORS.danger,
                    }}
                  >
                    {t(`identify.confidence.${result.confidence}`)}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between mb-sm">
                <Text className="text-caption text-text-secondary">
                  {t("banknote.denomination")}
                </Text>
                <Text className="text-body text-text-primary">
                  {result.denomination} {result.currency}
                </Text>
              </View>

              {result.yearStart && (
                <View className="flex-row justify-between mb-sm">
                  <Text className="text-caption text-text-secondary">
                    {t("banknote.yearStart")}
                  </Text>
                  <Text className="text-body text-text-primary">
                    {result.yearStart}
                    {result.isCurrent ? ` - ${t("banknote.present")}` : result.yearEnd ? ` - ${result.yearEnd}` : ""}
                  </Text>
                </View>
              )}

              {result.notes && (
                <View className="mt-sm pt-sm" style={{ borderTopWidth: 1, borderTopColor: COLORS.border }}>
                  <Text className="text-caption text-text-muted">
                    {result.notes}
                  </Text>
                </View>
              )}
            </View>

            <GoldButton
              title={t("identify.addToCollection")}
              onPress={handleUseResult}
            />
          </View>
        )}

        {result && !country && (
          <View className="bg-surface rounded-lg p-md items-center mt-lg">
            <Text className="text-body text-text-secondary text-center">
              {t("identify.countryNotFound", { country: result.countryName })}
            </Text>
          </View>
        )}
      </View>

      <View style={{ height: insets.bottom + 16 }} />
    </View>
  );
}

import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { useTranslation } from "react-i18next";
import { getCountry } from "@/constants/countries";
import { ACHIEVEMENTS } from "@/constants/achievements";
import { useBanknoteStore, type MilestoneEvent } from "@/store/useBanknoteStore";
import { savePhoto } from "@/utils/photos";
import { Header } from "@/components/Header";
import { PhotoCapture } from "@/components/PhotoCapture";
import { YearPicker } from "@/components/YearPicker";
import { GoldButton } from "@/components/GoldButton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { AchievementUnlockModal } from "@/components/AchievementUnlockModal";
import { COLORS } from "@/constants/theme";

interface FormErrors {
  denomination?: string;
  frontPhoto?: string;
  yearStart?: string;
  yearEnd?: string;
}

export default function AddBanknoteScreen() {
  const params = useLocalSearchParams<{
    countryCode: string;
    denomination?: string;
    currency?: string;
    yearStart?: string;
    yearEnd?: string;
    isCurrent?: string;
    photoUri?: string;
    notes?: string;
  }>();
  const { countryCode } = params;
  const { t } = useTranslation();
  const router = useRouter();
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const addBanknote = useBanknoteStore((s) => s.addBanknote);

  const country = getCountry(countryCode);

  const [denomination, setDenomination] = useState(params.denomination || "");
  const [frontPhotoUri, setFrontPhotoUri] = useState<string | undefined>(
    params.photoUri ? decodeURIComponent(params.photoUri) : undefined
  );
  const [backPhotoUri, setBackPhotoUri] = useState<string>();
  const [yearStart, setYearStart] = useState(params.yearStart || "");
  const [yearEnd, setYearEnd] = useState(params.yearEnd || "");
  const [isCurrent, setIsCurrent] = useState(params.isCurrent === "1");
  const [notes, setNotes] = useState(
    params.notes ? decodeURIComponent(params.notes) : ""
  );
  const [serialNumber, setSerialNumber] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const hasUnsavedChanges = () => {
    return !!(denomination.trim() || frontPhotoUri || backPhotoUri || yearStart.trim() || notes.trim() || serialNumber.trim());
  };

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowDiscardDialog(true);
    } else {
      router.back();
    }
  };

  // Celebration state
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [celebrationEmoji, setCelebrationEmoji] = useState("");
  const [celebrationTitle, setCelebrationTitle] = useState("");
  const [celebrationSubtitle, setCelebrationSubtitle] = useState("");
  const [achievementQueue, setAchievementQueue] = useState<string[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<string | null>(null);

  if (!country) {
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

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!denomination.trim()) {
      newErrors.denomination = t("validation.denominationRequired");
    }
    if (yearStart.trim()) {
      const ys = parseInt(yearStart, 10);
      if (isNaN(ys) || ys < 1600 || ys > 2100) {
        newErrors.yearStart = t("validation.yearInvalid");
      }
    }
    if (yearEnd.trim() && !isCurrent) {
      const ye = parseInt(yearEnd, 10);
      const ys = parseInt(yearStart, 10);
      if (isNaN(ye) || ye < 1600 || ye > 2100) {
        newErrors.yearEnd = t("validation.yearInvalid");
      } else if (!isNaN(ys) && ye < ys) {
        newErrors.yearEnd = t("validation.yearEndBeforeStart");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showMilestones = (milestones: MilestoneEvent[]) => {
    // Find the most important milestone to show as celebration
    const countMilestone = milestones.find((m) => m.type === "count_milestone");
    const newCountry = milestones.find((m) => m.type === "new_country");
    const achievements = milestones
      .filter((m) => m.type === "achievement")
      .map((m) => m.achievementId!)
      .filter(Boolean);

    if (countMilestone) {
      setCelebrationEmoji("\uD83C\uDF89");
      setCelebrationTitle(t("celebration.milestone", { count: countMilestone.count }));
      setCelebrationSubtitle(t("celebration.awesome"));
      setCelebrationVisible(true);
    } else if (newCountry) {
      setCelebrationEmoji("\uD83C\uDF0D");
      setCelebrationTitle(t("celebration.newCountry"));
      setCelebrationSubtitle(country ? t(country.nameKey) : "");
      setCelebrationVisible(true);
    }

    if (achievements.length > 0) {
      setAchievementQueue(achievements);
      // If no celebration overlay, show achievement immediately
      if (!countMilestone && !newCountry) {
        setCurrentAchievement(achievements[0]);
        setAchievementQueue(achievements.slice(1));
      }
    } else if (!countMilestone && !newCountry) {
      // No milestones at all, just go back
      router.back();
    }
  };

  const handleCelebrationDismiss = () => {
    setCelebrationVisible(false);
    if (achievementQueue.length > 0) {
      setCurrentAchievement(achievementQueue[0]);
      setAchievementQueue(achievementQueue.slice(1));
    } else {
      router.back();
    }
  };

  const handleAchievementDismiss = () => {
    setCurrentAchievement(null);
    if (achievementQueue.length > 0) {
      setCurrentAchievement(achievementQueue[0]);
      setAchievementQueue(achievementQueue.slice(1));
    } else {
      router.back();
    }
  };

  const handleSave = async () => {
    if (!validate() || saving) return;

    setSaving(true);
    try {
      const savedFrontPhoto = frontPhotoUri ? savePhoto(frontPhotoUri) : "";
      const savedBackPhoto = backPhotoUri ? savePhoto(backPhotoUri) : null;

      const { milestones } = addBanknote(db, {
        country_code: countryCode,
        denomination: denomination.trim(),
        currency: country.currency,
        front_photo: savedFrontPhoto,
        back_photo: savedBackPhoto,
        year_start: yearStart.trim() ? parseInt(yearStart, 10) : 0,
        year_end:
          isCurrent || !yearEnd.trim()
            ? null
            : parseInt(yearEnd, 10),
        is_current: isCurrent ? 1 : 0,
        notes: notes.trim() || null,
        serial_number: serialNumber.trim() || null,
      });

      if (milestones.length > 0) {
        showMilestones(milestones);
      } else {
        router.back();
      }
    } catch (error) {
      Alert.alert(
        t("common.error"),
        t("banknote.saveError")
      );
    } finally {
      setSaving(false);
    }
  };

  const achievementDef = currentAchievement
    ? ACHIEVEMENTS.find((a) => a.id === currentAchievement) ?? null
    : null;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header
        title={t("banknote.addTitle")}
        showBack
        onBack={handleBack}
        rightAction={
          <Pressable onPress={handleSave} disabled={saving} className="flex-row items-center">
            <Ionicons name="checkmark" size={20} color={saving ? COLORS.textMuted : COLORS.accent} />
            <Text className="text-caption ml-xs" style={{ color: saving ? COLORS.textMuted : COLORS.accent }}>{t("banknote.save")}</Text>
          </Pressable>
        }
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-xl pb-lg"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Denomination */}
          <View className="mb-lg">
            <Text className="text-caption text-text-secondary mb-xs">
              {t("banknote.denomination")}{" "}
              <Text className="text-danger">*</Text>
            </Text>
            <TextInput
              value={denomination}
              onChangeText={setDenomination}
              keyboardType="number-pad"
              placeholder={t("banknote.denominationPlaceholder")}
              placeholderTextColor={COLORS.textMuted}
              className="h-12 bg-surface rounded-md px-md text-text-primary text-body"
              style={{
                borderWidth: 1,
                borderColor: errors.denomination
                  ? COLORS.danger
                  : COLORS.border,
              }}
            />
            {errors.denomination && (
              <Text className="text-caption text-danger mt-xs">
                {errors.denomination}
              </Text>
            )}
          </View>

          {/* Currency (read-only) */}
          <View className="mb-lg">
            <Text className="text-caption text-text-secondary mb-xs">
              {t("banknote.currency")}
            </Text>
            <View className="h-12 bg-surface rounded-md px-md justify-center opacity-50"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
            >
              <Text className="text-body text-text-muted">
                {country.currency}
              </Text>
            </View>
          </View>

          {/* Front Photo */}
          <View className="mb-lg">
            <PhotoCapture
              label={t("banknote.frontPhoto")}
              photoUri={frontPhotoUri}
              onPhotoSelected={setFrontPhotoUri}
              error={errors.frontPhoto}
            />
          </View>

          {/* Back Photo */}
          <View className="mb-lg">
            <PhotoCapture
              label={t("banknote.backPhoto")}
              photoUri={backPhotoUri}
              onPhotoSelected={setBackPhotoUri}
            />
          </View>

          {/* Year Picker */}
          <View className="mb-lg">
            <YearPicker
              yearStart={yearStart}
              yearEnd={yearEnd}
              isCurrent={isCurrent}
              onYearStartChange={setYearStart}
              onYearEndChange={setYearEnd}
              onIsCurrentChange={setIsCurrent}
              errors={{
                yearStart: errors.yearStart,
                yearEnd: errors.yearEnd,
              }}
            />
          </View>

          {/* Serial Number */}
          <View className="mb-lg">
            <Text className="text-caption text-text-secondary mb-xs">
              {t("banknote.serialNumber")}
            </Text>
            <TextInput
              value={serialNumber}
              onChangeText={setSerialNumber}
              placeholder={t("banknote.serialNumberPlaceholder")}
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="characters"
              className="h-12 bg-surface rounded-md px-md text-text-primary text-body"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
            />
          </View>

          {/* Notes */}
          <View className="mb-lg">
            <Text className="text-caption text-text-secondary mb-xs">
              {t("banknote.notes")}
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              placeholder={t("banknote.notesPlaceholder")}
              placeholderTextColor={COLORS.textMuted}
              className="bg-surface rounded-md px-md py-sm text-text-primary text-body"
              style={{
                borderWidth: 1,
                borderColor: COLORS.border,
                minHeight: 100,
                textAlignVertical: "top",
              }}
            />
          </View>

          {/* Save Button */}
          <GoldButton
            title={t("banknote.save")}
            onPress={handleSave}
            loading={saving}
          />

          <View style={{ height: insets.bottom + 16 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Celebration Overlay */}
      <CelebrationOverlay
        visible={celebrationVisible}
        emoji={celebrationEmoji}
        title={celebrationTitle}
        subtitle={celebrationSubtitle}
        onDismiss={handleCelebrationDismiss}
      />

      {/* Achievement Unlock Modal */}
      <AchievementUnlockModal
        visible={!!currentAchievement}
        achievement={achievementDef}
        onDismiss={handleAchievementDismiss}
      />

      <ConfirmDialog
        visible={showDiscardDialog}
        title={t("banknote.discardTitle")}
        message={t("banknote.discardMessage")}
        confirmLabel={t("banknote.discardConfirm")}
        onConfirm={() => {
          setShowDiscardDialog(false);
          router.back();
        }}
        onCancel={() => setShowDiscardDialog(false)}
        destructive
      />
    </View>
  );
}

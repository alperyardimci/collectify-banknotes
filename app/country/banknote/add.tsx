import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { useTranslation } from "react-i18next";
import { getCountry } from "@/constants/countries";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { savePhoto } from "@/utils/photos";
import { Header } from "@/components/Header";
import { PhotoCapture } from "@/components/PhotoCapture";
import { YearPicker } from "@/components/YearPicker";
import { GoldButton } from "@/components/GoldButton";
import { COLORS } from "@/constants/theme";

interface FormErrors {
  denomination?: string;
  frontPhoto?: string;
  yearStart?: string;
  yearEnd?: string;
}

export default function AddBanknoteScreen() {
  const { countryCode } = useLocalSearchParams<{ countryCode: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const addBanknote = useBanknoteStore((s) => s.addBanknote);

  const country = getCountry(countryCode);

  const [denomination, setDenomination] = useState("");
  const [frontPhotoUri, setFrontPhotoUri] = useState<string>();
  const [backPhotoUri, setBackPhotoUri] = useState<string>();
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  if (!country) return null;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!denomination.trim()) {
      newErrors.denomination = t("validation.denominationRequired");
    }
    if (!frontPhotoUri) {
      newErrors.frontPhoto = t("validation.frontPhotoRequired");
    }
    if (!yearStart.trim()) {
      newErrors.yearStart = t("validation.yearStartRequired");
    } else {
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

  const handleSave = async () => {
    if (!validate() || saving) return;

    setSaving(true);
    try {
      const savedFrontPhoto = savePhoto(frontPhotoUri!);
      const savedBackPhoto = backPhotoUri ? savePhoto(backPhotoUri) : null;

      addBanknote(db, {
        country_code: countryCode,
        denomination: denomination.trim(),
        currency: country.currency,
        front_photo: savedFrontPhoto,
        back_photo: savedBackPhoto,
        year_start: parseInt(yearStart, 10),
        year_end:
          isCurrent || !yearEnd.trim()
            ? null
            : parseInt(yearEnd, 10),
        is_current: isCurrent ? 1 : 0,
        notes: notes.trim() || null,
      });

      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header title={t("banknote.addTitle")} showBack />

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
              required
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
    </View>
  );
}

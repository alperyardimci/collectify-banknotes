import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { useTranslation } from "react-i18next";
import { useBanknoteStore } from "@/store/useBanknoteStore";
import { savePhoto, deletePhoto } from "@/utils/photos";
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

export default function EditBanknoteScreen() {
  const { banknoteId, countryCode } = useLocalSearchParams<{
    banknoteId: string;
    countryCode: string;
  }>();
  const { t } = useTranslation();
  const router = useRouter();
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const banknotes = useBanknoteStore((s) => s.banknotes);
  const updateBanknote = useBanknoteStore((s) => s.updateBanknote);

  const banknote = useMemo(
    () => banknotes.find((b) => b.id === parseInt(banknoteId, 10)),
    [banknotes, banknoteId]
  );

  const [denomination, setDenomination] = useState(banknote?.denomination ?? "");
  const [frontPhotoUri, setFrontPhotoUri] = useState<string | undefined>(
    banknote?.front_photo
  );
  const [backPhotoUri, setBackPhotoUri] = useState<string | undefined>(
    banknote?.back_photo ?? undefined
  );
  const [yearStart, setYearStart] = useState(
    banknote?.year_start?.toString() ?? ""
  );
  const [yearEnd, setYearEnd] = useState(
    banknote?.year_end?.toString() ?? ""
  );
  const [isCurrent, setIsCurrent] = useState(
    banknote?.is_current === 1
  );
  const [notes, setNotes] = useState(banknote?.notes ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  if (!banknote) {
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
      let newFrontPhoto = banknote.front_photo;
      if (frontPhotoUri && frontPhotoUri !== banknote.front_photo) {
        newFrontPhoto = savePhoto(frontPhotoUri);
        deletePhoto(banknote.front_photo);
      }

      let newBackPhoto: string | null = banknote.back_photo;
      if (backPhotoUri && backPhotoUri !== banknote.back_photo) {
        newBackPhoto = savePhoto(backPhotoUri);
        if (banknote.back_photo) deletePhoto(banknote.back_photo);
      } else if (!backPhotoUri && banknote.back_photo) {
        deletePhoto(banknote.back_photo);
        newBackPhoto = null;
      }

      updateBanknote(db, banknote.id, {
        denomination: denomination.trim(),
        front_photo: newFrontPhoto,
        back_photo: newBackPhoto,
        year_start: parseInt(yearStart, 10),
        year_end:
          isCurrent || !yearEnd.trim()
            ? null
            : parseInt(yearEnd, 10),
        is_current: isCurrent ? 1 : 0,
        notes: notes.trim() || null,
      });

      router.back();
    } catch (error) {
      Alert.alert(
        t("common.error"),
        t("banknote.saveError")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header title={t("banknote.editTitle")} showBack />

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

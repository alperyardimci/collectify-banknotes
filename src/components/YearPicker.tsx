import { View, Text, TextInput, Switch } from "react-native";
import { useTranslation } from "react-i18next";
import { COLORS } from "@/constants/theme";

interface YearPickerProps {
  yearStart: string;
  yearEnd: string;
  isCurrent: boolean;
  onYearStartChange: (value: string) => void;
  onYearEndChange: (value: string) => void;
  onIsCurrentChange: (value: boolean) => void;
  errors?: { yearStart?: string; yearEnd?: string };
}

export function YearPicker({
  yearStart,
  yearEnd,
  isCurrent,
  onYearStartChange,
  onYearEndChange,
  onIsCurrentChange,
  errors,
}: YearPickerProps) {
  const { t } = useTranslation();

  return (
    <View>
      <View className="flex-row gap-md">
        <View className="flex-1">
          <Text className="text-caption text-text-secondary mb-xs">
            {t("banknote.yearStart")} <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            value={yearStart}
            onChangeText={onYearStartChange}
            keyboardType="number-pad"
            maxLength={4}
            placeholder="2009"
            placeholderTextColor={COLORS.textMuted}
            className="h-12 bg-surface rounded-md px-md text-text-primary text-body"
            style={{
              borderWidth: 1,
              borderColor: errors?.yearStart ? COLORS.danger : COLORS.border,
            }}
          />
          {errors?.yearStart && (
            <Text className="text-caption text-danger mt-xs">
              {errors.yearStart}
            </Text>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-caption text-text-secondary mb-xs">
            {t("banknote.yearEnd")}
          </Text>
          <TextInput
            value={isCurrent ? t("banknote.present") : yearEnd}
            onChangeText={onYearEndChange}
            keyboardType="number-pad"
            maxLength={4}
            editable={!isCurrent}
            placeholder="2024"
            placeholderTextColor={COLORS.textMuted}
            className={`h-12 bg-surface rounded-md px-md text-body ${
              isCurrent ? "text-text-muted opacity-50" : "text-text-primary"
            }`}
            style={{
              borderWidth: 1,
              borderColor: errors?.yearEnd ? COLORS.danger : COLORS.border,
            }}
          />
          {errors?.yearEnd && (
            <Text className="text-caption text-danger mt-xs">
              {errors.yearEnd}
            </Text>
          )}
        </View>
      </View>
      <View className="flex-row items-center justify-between mt-md">
        <Text className="text-body text-text-primary">
          {t("banknote.stillInCirculation")}
        </Text>
        <Switch
          value={isCurrent}
          onValueChange={onIsCurrentChange}
          trackColor={{ false: COLORS.surfaceLight, true: COLORS.accent }}
          thumbColor={COLORS.textPrimary}
        />
      </View>
    </View>
  );
}

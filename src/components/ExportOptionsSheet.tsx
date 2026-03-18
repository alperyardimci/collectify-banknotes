import { View, Text, Pressable, Modal, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { COLORS } from "@/constants/theme";

interface ExportOptionsSheetProps {
  visible: boolean;
  loading: boolean;
  onExportCSV: () => void;
  onExportPDF: () => void;
  onClose: () => void;
}

export function ExportOptionsSheet({
  visible,
  loading,
  onExportCSV,
  onExportPDF,
  onClose,
}: ExportOptionsSheetProps) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        onPress={onClose}
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-surface rounded-t-xl px-xl pt-lg pb-2xl"
        >
          <View className="w-10 h-1 bg-text-muted rounded-full self-center mb-lg" />
          <Text className="text-h2 text-text-primary mb-lg">
            {t("export.title")}
          </Text>

          {loading ? (
            <View className="items-center py-xl">
              <ActivityIndicator size="large" color={COLORS.accent} />
              <Text className="text-body text-text-secondary mt-md">
                {t("export.generating")}
              </Text>
            </View>
          ) : (
            <>
              <Pressable
                onPress={onExportCSV}
                className="flex-row items-center bg-surface-light rounded-lg p-md mb-sm"
                style={{ borderWidth: 1, borderColor: COLORS.border }}
              >
                <View className="w-10 h-10 rounded-md bg-accent/10 items-center justify-center mr-md">
                  <Ionicons name="document-text-outline" size={22} color={COLORS.accent} />
                </View>
                <View className="flex-1">
                  <Text className="text-body text-text-primary">{t("export.csv")}</Text>
                  <Text className="text-caption text-text-secondary">{t("export.csvDescription")}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
              </Pressable>

              <Pressable
                onPress={onExportPDF}
                className="flex-row items-center bg-surface-light rounded-lg p-md"
                style={{ borderWidth: 1, borderColor: COLORS.border }}
              >
                <View className="w-10 h-10 rounded-md bg-accent/10 items-center justify-center mr-md">
                  <Ionicons name="document-outline" size={22} color={COLORS.accent} />
                </View>
                <View className="flex-1">
                  <Text className="text-body text-text-primary">{t("export.pdf")}</Text>
                  <Text className="text-caption text-text-secondary">{t("export.pdfDescription")}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

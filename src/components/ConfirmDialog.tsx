import { Modal, View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onConfirm();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        className="flex-1 bg-black/60 items-center justify-center px-xl"
        onPress={onCancel}
      >
        <Pressable
          className="w-full bg-surface rounded-xl p-lg"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-h2 text-text-primary mb-sm">{title}</Text>
          <Text className="text-body text-text-secondary mb-lg">{message}</Text>
          <View className="flex-row justify-end gap-md">
            <Pressable
              onPress={onCancel}
              className="px-md py-sm"
              accessibilityRole="button"
            >
              <Text className="text-h3 text-text-secondary">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              className={`px-md py-sm rounded-md ${
                destructive ? "bg-danger" : "bg-accent"
              }`}
              accessibilityRole="button"
            >
              <Text
                className={`text-h3 ${
                  destructive ? "text-text-primary" : "text-background"
                }`}
              >
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

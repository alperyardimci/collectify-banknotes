import { View, Text, Pressable, Alert, ActionSheetIOS, Platform } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { COLORS } from "@/constants/theme";

interface PhotoCaptureProps {
  label: string;
  photoUri?: string;
  onPhotoSelected: (uri: string) => void;
  required?: boolean;
  error?: string;
}

export function PhotoCapture({
  label,
  photoUri,
  onPhotoSelected,
  required = false,
  error,
}: PhotoCaptureProps) {
  const { t } = useTranslation();

  const launchCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t("common.permissionDenied"), t("common.cameraPermission"));
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      onPhotoSelected(result.assets[0].uri);
    }
  };

  const launchGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t("common.permissionDenied"), t("common.galleryPermission"));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      allowsEditing: false,
      mediaTypes: ["images"],
    });
    if (!result.canceled && result.assets[0]) {
      onPhotoSelected(result.assets[0].uri);
    }
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t("banknote.cancel"), t("banknote.camera"), t("banknote.gallery")],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) launchCamera();
          if (buttonIndex === 2) launchGallery();
        }
      );
    } else {
      Alert.alert(label, undefined, [
        { text: t("banknote.camera"), onPress: launchCamera },
        { text: t("banknote.gallery"), onPress: launchGallery },
        { text: t("banknote.cancel"), style: "cancel" },
      ]);
    }
  };

  return (
    <View>
      <Text className="text-caption text-text-secondary mb-xs">
        {label}
        {required && <Text className="text-danger"> *</Text>}
      </Text>
      <Pressable onPress={handlePress} className="overflow-hidden rounded-lg">
        {photoUri ? (
          <View className="h-[200px] bg-surface rounded-lg overflow-hidden">
            <Image
              source={{ uri: photoUri }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
            <View className="absolute bottom-2 right-2 bg-surface/80 rounded-md px-sm py-xs">
              <Text className="text-caption text-text-primary">
                {t("banknote.changePhoto")}
              </Text>
            </View>
          </View>
        ) : (
          <View
            className="h-[200px] bg-surface rounded-lg items-center justify-center"
            style={{ borderWidth: 1.5, borderColor: error ? COLORS.danger : COLORS.border, borderStyle: "dashed" }}
          >
            <Ionicons name="camera-outline" size={40} color={COLORS.textMuted} />
            <Text className="text-body text-text-muted mt-sm">{label}</Text>
          </View>
        )}
      </Pressable>
      {error && (
        <Text className="text-caption text-danger mt-xs">{error}</Text>
      )}
    </View>
  );
}

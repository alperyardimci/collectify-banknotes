import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useReducedMotion,
} from "react-native-reanimated";

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
}

export function ProgressBar({ progress, showLabel = false }: ProgressBarProps) {
  const reducedMotion = useReducedMotion();
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const animatedStyle = useAnimatedStyle(() => {
    const width = reducedMotion
      ? `${clampedProgress * 100}%`
      : withTiming(`${clampedProgress * 100}%`, { duration: 300 });
    return { width: width as unknown as number };
  });

  return (
    <View className="flex-row items-center gap-sm">
      <View className="flex-1 h-1.5 bg-surface-light rounded-full overflow-hidden">
        <Animated.View
          style={animatedStyle}
          className={`h-full rounded-full bg-accent ${
            clampedProgress >= 1 ? "shadow-accent" : ""
          }`}
        />
      </View>
      {showLabel && (
        <Text className="text-caption text-text-secondary">
          {Math.round(clampedProgress * 100)}%
        </Text>
      )}
    </View>
  );
}

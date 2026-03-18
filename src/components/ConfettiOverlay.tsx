import { useEffect } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const PARTICLE_COUNT = 45;
const COLORS_PALETTE = [
  "#D4A843",
  "#B8922F",
  "#F0EBE3",
  "#FFD700",
  "#FFA500",
  "#E85D5D",
  "#4CAF82",
  "#8B8D9E",
];

interface ConfettiOverlayProps {
  visible: boolean;
  onFinish?: () => void;
}

function Particle({ delay, onLast }: { delay: number; onLast?: () => void }) {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const startX = Math.random() * SCREEN_WIDTH;
  const drift = (Math.random() - 0.5) * 120;
  const color = COLORS_PALETTE[Math.floor(Math.random() * COLORS_PALETTE.length)];
  const size = 6 + Math.random() * 6;
  const isSquare = Math.random() > 0.5;
  const duration = 2500 + Math.random() * 1000;

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 50, { duration, easing: Easing.out(Easing.quad) })
    );
    translateX.value = withDelay(
      delay,
      withTiming(drift, { duration, easing: Easing.inOut(Easing.sin) })
    );
    rotate.value = withDelay(
      delay,
      withTiming(360 * (Math.random() > 0.5 ? 1 : -1) * 3, { duration })
    );
    opacity.value = withDelay(
      delay + duration * 0.7,
      withTiming(0, { duration: duration * 0.3 }, () => {
        if (onLast) runOnJS(onLast)();
      })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: startX,
          top: -10,
          width: size,
          height: isSquare ? size : size * 0.4,
          backgroundColor: color,
          borderRadius: isSquare ? 1 : size,
        },
        style,
      ]}
    />
  );
}

export function ConfettiOverlay({ visible, onFinish }: ConfettiOverlayProps) {
  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Particle
          key={i}
          delay={Math.random() * 600}
          onLast={i === PARTICLE_COUNT - 1 ? onFinish : undefined}
        />
      ))}
    </View>
  );
}

import { Image } from "expo-image";

interface EmojiImageProps {
  emoji: string;
  size?: number;
}

function emojiToTwemojiUrl(emoji: string): string {
  const codePoints = Array.from(emoji)
    .map((char) => char.codePointAt(0)!.toString(16))
    .filter((cp) => cp !== "fe0f")
    .join("-");
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${codePoints}.png`;
}

export function EmojiImage({ emoji, size = 28 }: EmojiImageProps) {
  return (
    <Image
      source={{ uri: emojiToTwemojiUrl(emoji) }}
      style={{ width: size, height: size }}
      contentFit="contain"
      cachePolicy="disk"
    />
  );
}

import { EmojiImage } from "./EmojiImage";

interface FlagIconProps {
  code: string;
  flag: string;
  size?: number;
}

export function FlagIcon({ code, flag, size = 24 }: FlagIconProps) {
  return <EmojiImage emoji={flag} size={size} />;
}

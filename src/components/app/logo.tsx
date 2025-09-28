import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <Image
      src="https://media.discordapp.net/attachments/1116720480544636999/1274425873201631304/TP_NEW_WB_PNGxxxhdpi.png?ex=68d4d8d5&is=68d38755&hm=b6d4e0e4ef2c3215a4de4fb2f592189a60ddd94c651f96fe04deac2e7f96ddc6&=&format=webp&quality=lossless&width=826&height=826"
      alt="Tamil Pasanga Logo"
      width={size}
      height={size}
      className={cn(className)}
    />
  );
}

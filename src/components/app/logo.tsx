import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <Image
      src="https://media.discordapp.net/attachments/812969396540145694/1420219258834518171/unwatermark_1000037663.gif?ex=68d73cc1&is=68d5eb41&hm=da217b31eec1b8f5b51d6c96503a92782ca1d386bb6e1b35148b0bcda1e0c1a2&"
      alt="Tamil Pasanga Logo"
      width={size}
      height={size}
      className={cn(className)}
      unoptimized
    />
  );
}

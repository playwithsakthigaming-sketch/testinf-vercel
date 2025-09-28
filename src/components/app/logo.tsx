import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <Image
      src="https://media.discordapp.net/attachments/812969396540145694/1420219258834518171/unwatermark_1000037663.gif?ex=68d9dfc1&is=68d88e41&hm=66b812dfa84c8728ba006c020bcf650adff9ebc427961ed5f97050126b9ba9cc&="
      alt="Tamil Pasanga Logo"
      width={size}
      height={size}
      className={cn(className)}
      unoptimized
    />
  );
}

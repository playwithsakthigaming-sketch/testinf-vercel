import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <Image
      src="https://media.discordapp.net/attachments/812969396540145694/1420219258834518171/unwatermark_1000037663.gif?ex=68dc82c1&is=68db3141&hm=40bdee103cd783ec34940defae272892bf638c52fabefae6e000f9af410af050&=&width=350&height=350"
      alt="Tamil Pasanga Logo"
      width={size}
      height={size}
      className={cn(className)}
      unoptimized
    />
  );
}

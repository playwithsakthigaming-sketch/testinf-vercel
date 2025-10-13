import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <Image
      src="https://files.catbox.moe/5mheop.gif"
      alt="Tamil Pasanga Logo"
      width={size}
      height={size}
      className={cn(className)}
      unoptimized
    />
  );
}

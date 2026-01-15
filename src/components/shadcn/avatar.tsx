"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      "duration-300 ease-in-out animate-in fade-in zoom-in",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

type AvatarImageProps = Omit<ImageProps, "src"> & {
  src: string;
  priority?: boolean;
};

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, src, alt, priority = false, ...props }, ref) => {
  const [isLoading, setIsLoading] = React.useState(true);
  console.log("AvatarImage props:", { src, alt, isLoading, ...props });

  if (!src) return null;

  return (
    <AvatarPrimitive.Image ref={ref} asChild>
      <Image
        src={src}
        alt={alt || ""}
        className={cn(
          "aspect-square h-full w-full",
          "duration-300 ease-in-out animate-in fade-in",
          isLoading ? "opacity-0" : "opacity-100",
          className,
        )}
        width={40}
        height={40}
        priority={priority}
        onLoadingComplete={() => setIsLoading(false)}
        {...props}
      />
    </AvatarPrimitive.Image>
  );
});
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
    delayMs?: number;
  }
>(({ className, delayMs = 0, ...props }, ref) => {
  const [isDelayComplete, setIsDelayComplete] = React.useState(delayMs === 0);

  React.useEffect(() => {
    if (delayMs !== 0) {
      const timer = setTimeout(() => setIsDelayComplete(true), delayMs);
      return () => clearTimeout(timer);
    }
  }, [delayMs]);

  if (!isDelayComplete) {
    return null;
  }

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white",
        "duration-300 ease-in-out animate-in fade-in",
        className,
      )}
      {...props}
    />
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };

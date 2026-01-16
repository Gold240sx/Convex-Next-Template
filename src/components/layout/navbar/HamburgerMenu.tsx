"use client";

import { cn } from "@/lib/utils";

interface HamburgerMenuProps {
  navbarOpen: boolean;
  setNavbarOpen: (open: boolean) => void;
  newsBannerOpen: boolean;
  pathname: string;
  className?: string;
}

export default function HamburgerMenu({
  navbarOpen,
  setNavbarOpen,
  newsBannerOpen,
  pathname,
  className,
}: HamburgerMenuProps) {
  return (
    <button
      className={cn(
        "relative h-10 w-10 focus:outline-none",
        {
          "top-0": !newsBannerOpen,
          "top-8": newsBannerOpen,
        },
        className,
      )}
      onClick={() => setNavbarOpen(!navbarOpen)}
    >
      <div className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 transform">
        <span
          className={cn(
            "absolute block h-0.5 w-5 transform bg-current transition duration-500 ease-in-out",
            {
              "rotate-45": navbarOpen,
              "-translate-y-1.5": !navbarOpen,
            },
          )}
        />
        <span
          className={cn(
            "absolute block h-0.5 w-5 transform bg-current transition duration-500 ease-in-out",
            {
              "opacity-0": navbarOpen,
            },
          )}
        />
        <span
          className={cn(
            "absolute block h-0.5 w-5 transform bg-current transition duration-500 ease-in-out",
            {
              "-rotate-45": navbarOpen,
              "translate-y-1.5": !navbarOpen,
            },
          )}
        />
      </div>
    </button>
  );
}

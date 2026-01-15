"use client";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="container mx-auto">{children}</div>
    </div>
  );
}

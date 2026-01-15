"use client";

import { useParams, useSearchParams } from "next/navigation";
import { z } from "zod";

export function useSafeParams<T extends z.ZodObject<any>>(schema: T) {
  const params = useParams();
  const result = schema.parse(params);
  return result as z.infer<T>;
}

export function useSafeSearchParams<T extends z.ZodObject<any>>(schema: T) {
  const params = useSearchParams();
  const result = schema.parse(params);
  return result as z.infer<T>;
}

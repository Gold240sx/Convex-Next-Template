import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Metadata } from "next";

/**
 * Hook to fetch SEO metadata for a specific page path
 * Use this in client components to get SEO data
 */
export function useSeoMetadata(pagePath: string) {
  const seoData = useQuery(api.seoMetadata.getSeoByPath, { pagePath });
  return seoData;
}

/**
 * Generate Next.js Metadata object from SEO data
 * Use this in server components or generateMetadata functions
 */
export function generateMetadataFromSeo(seoData: any, baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"): Metadata {
  if (!seoData || !seoData.isActive) {
    return {};
  }

  const metadata: Metadata = {
    title: seoData.pageTitle,
    description: seoData.metaDescription,
    keywords: seoData.keywords,
    robots: seoData.robots || "index, follow",
    
    // Open Graph
    openGraph: {
      title: seoData.ogTitle || seoData.pageTitle,
      description: seoData.ogDescription || seoData.metaDescription,
      images: seoData.ogImage ? [{
        url: seoData.ogImage,
        alt: seoData.ogImageAlt || seoData.pageTitle,
      }] : undefined,
      type: "website",
    },
    
    // Twitter
    twitter: {
      card: seoData.twitterCard || "summary_large_image",
      title: seoData.twitterTitle || seoData.ogTitle || seoData.pageTitle,
      description: seoData.twitterDescription || seoData.ogDescription || seoData.metaDescription,
      images: seoData.twitterImage || seoData.ogImage ? [seoData.twitterImage || seoData.ogImage] : undefined,
    },
    
    // Canonical URL
    alternates: seoData.canonicalUrl ? {
      canonical: seoData.canonicalUrl,
    } : undefined,
  };

  return metadata;
}

/**
 * Fetch SEO metadata on the server side (for generateMetadata)
 * This is a server-side only function
 */
export async function fetchSeoMetadata(pagePath: string) {
  try {
    // In a real implementation, you'd use Convex's server-side API
    // For now, this is a placeholder that you'll need to implement
    // based on your Convex setup
    
    // Example using fetch to your Convex API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: 'seoMetadata:getSeoByPath',
        args: { pagePath },
      }),
      cache: 'no-store', // Don't cache SEO data
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('Error fetching SEO metadata:', error);
    return null;
  }
}

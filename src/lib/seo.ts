import { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";

/**
 * Generate Next.js Metadata from SEO data stored in Convex
 * Use this in your page's generateMetadata function
 * 
 * @example
 * ```typescript
 * export async function generateMetadata(): Promise<Metadata> {
 *   return await generateSeoMetadata('/about');
 * }
 * ```
 */
export async function generateSeoMetadata(
  pagePath: string,
  fallback?: Partial<Metadata>
): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  try {
    // Fetch SEO data from Convex
    const seoData = await fetchQuery(api.seoMetadata.getSeoByPath, { pagePath });

    if (!seoData || !seoData.isActive) {
      return fallback || {};
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
        images: seoData.ogImage
          ? [
              {
                url: seoData.ogImage,
                alt: seoData.ogImageAlt || seoData.pageTitle,
              },
            ]
          : undefined,
        type: "website",
        url: `${baseUrl}${pagePath}`,
      },

      // Twitter
      twitter: {
        card: seoData.twitterCard || "summary_large_image",
        title:
          seoData.twitterTitle ||
          seoData.ogTitle ||
          seoData.pageTitle,
        description:
          seoData.twitterDescription ||
          seoData.ogDescription ||
          seoData.metaDescription,
        images:
          seoData.twitterImage || seoData.ogImage
            ? [seoData.twitterImage || seoData.ogImage]
            : undefined,
      },

      // Canonical URL
      alternates: seoData.canonicalUrl
        ? {
            canonical: seoData.canonicalUrl,
          }
        : {
            canonical: `${baseUrl}${pagePath}`,
          },
    };

    return metadata;
  } catch (error) {
    console.error(`Error fetching SEO metadata for ${pagePath}:`, error);
    return fallback || {};
  }
}

/**
 * Generate metadata for dynamic routes
 * Combines SEO data with dynamic content
 * 
 * @example
 * ```typescript
 * export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
 *   const post = await getPost(params.slug);
 *   return await generateDynamicSeoMetadata(`/blog/${params.slug}`, {
 *     title: post.title,
 *     description: post.excerpt,
 *     openGraph: {
 *       images: [post.coverImage],
 *     },
 *   });
 * }
 * ```
 */
export async function generateDynamicSeoMetadata(
  pagePath: string,
  contentMetadata: Partial<Metadata>
): Promise<Metadata> {
  // Try to get SEO override first
  const seoMetadata = await generateSeoMetadata(pagePath);

  // If SEO metadata exists and is active, use it
  if (seoMetadata.title) {
    return seoMetadata;
  }

  // Otherwise, use the content-based metadata
  return contentMetadata;
}

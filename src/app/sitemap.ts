import { MetadataRoute } from 'next'
import { fetchQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  
  try {
    // Fetch all active SEO entries
    const seoEntries = await fetchQuery(api.seoMetadata.getActiveSeo, {});
    
    // Convert SEO entries to sitemap format
    const sitemapEntries = seoEntries.map((entry) => ({
      url: `${baseUrl}${entry.pagePath}`,
      lastModified: new Date(entry.updatedAt),
      changeFrequency: entry.changeFrequency || 'weekly' as const,
      priority: entry.priority || 0.5,
    }));

    // Add default entries if they don't exist in SEO
    const defaultPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
    ];

    // Combine and deduplicate
    const allEntries = [...defaultPages, ...sitemapEntries];
    const uniqueEntries = allEntries.filter((entry, index, self) =>
      index === self.findIndex((e) => e.url === entry.url)
    );

    return uniqueEntries;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback sitemap with just the homepage
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}

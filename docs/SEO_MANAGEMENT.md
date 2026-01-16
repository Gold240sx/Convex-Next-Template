# SEO Management System - Implementation Guide

## Overview
This system allows you to manage SEO metadata for any page in your Next.js application from the admin panel. The SEO data is stored in Convex and automatically applied to pages on the server side.

## How It Works

### 1. **Database Schema** (`convex/schema.ts`)
The `seo_metadata` table stores SEO information for each page:
- **Basic SEO**: title, description, keywords
- **Open Graph**: OG title, description, image
- **Twitter Cards**: Twitter-specific metadata
- **Technical SEO**: canonical URLs, robots directives
- **Sitemap Data**: priority, change frequency

### 2. **Convex Functions** (`convex/seoMetadata.ts`)
- `upsertSeoMetadata` - Create or update SEO for a page
- `getSeoByPath` - Fetch SEO for a specific path
- `listAllSeo` - Get all SEO entries (for admin panel)
- `getActiveSeo` - Get active SEO entries (for sitemap)
- `deleteSeo` - Remove SEO entry
- `toggleSeoActive` - Enable/disable SEO

### 3. **React Hooks** (`src/hooks/useSeoMetadata.ts`)
- `useSeoMetadata(pagePath)` - Client-side hook
- `generateMetadataFromSeo(seoData)` - Convert to Next.js Metadata
- `fetchSeoMetadata(pagePath)` - Server-side fetch

## Usage Examples

### Example 1: Static Page with SEO

```typescript
// app/about/page.tsx
import { Metadata } from 'next';
import { fetchConvexQuery } from '@/lib/convex-server';
import { api } from '~/convex/_generated/api';
import { generateMetadataFromSeo } from '@/hooks/useSeoMetadata';

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await fetchConvexQuery(api.seoMetadata.getSeoByPath, { 
    pagePath: '/about' 
  });
  
  if (seoData) {
    return generateMetadataFromSeo(seoData);
  }
  
  // Fallback metadata
  return {
    title: 'About Us',
    description: 'Learn more about our company',
  };
}

export default function AboutPage() {
  return <div>About content...</div>;
}
```

### Example 2: Dynamic Page with SEO

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { fetchConvexQuery } from '@/lib/convex-server';
import { api } from '~/convex/_generated/api';
import { generateMetadataFromSeo } from '@/hooks/useSeoMetadata';

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  // Try to get SEO for this specific blog post
  const seoData = await fetchConvexQuery(api.seoMetadata.getSeoByPath, { 
    pagePath: `/blog/${params.slug}` 
  });
  
  if (seoData) {
    return generateMetadataFromSeo(seoData);
  }
  
  // Fallback: fetch blog post data and generate SEO
  const post = await fetchConvexQuery(api.blog.getBySlug, { slug: params.slug });
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <div>Blog post content...</div>;
}
```

### Example 3: Form Page with SEO

```typescript
// app/forms/[slug]/page.tsx
import { Metadata } from 'next';
import { fetchConvexQuery } from '@/lib/convex-server';
import { api } from '~/convex/_generated/api';
import { generateMetadataFromSeo } from '@/hooks/useSeoMetadata';

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  // Get form data
  const form = await fetchConvexQuery(api.myFunctions.getCustomFormBySlug, { 
    slug: params.slug 
  });
  
  if (!form) {
    return { title: 'Form Not Found' };
  }
  
  // Check if form has custom OG metadata
  if (form.ogMetadata) {
    return {
      title: form.ogMetadata.title || form.name,
      description: form.ogMetadata.description || `Fill out the ${form.name} form`,
      openGraph: {
        title: form.ogMetadata.title || form.name,
        description: form.ogMetadata.description,
        images: form.ogMetadata.image ? [{
          url: form.ogMetadata.image,
          alt: form.ogMetadata.imageAlt || form.name,
        }] : undefined,
      },
    };
  }
  
  // Check for general SEO metadata for forms
  const seoData = await fetchConvexQuery(api.seoMetadata.getSeoByPath, { 
    pagePath: `/forms/${params.slug}` 
  });
  
  if (seoData) {
    return generateMetadataFromSeo(seoData);
  }
  
  // Fallback
  return {
    title: form.name,
    description: `Fill out the ${form.name} form`,
  };
}

export default function FormPage({ params }: { params: { slug: string } }) {
  return <div>Form content...</div>;
}
```

## Admin Panel Integration

### SEO Management Page (`/admin/seo`)

Create an admin page where you can:
1. **List all pages** with SEO configured
2. **Add new SEO** for any page path
3. **Edit existing SEO** metadata
4. **Preview** how it will look on Google/Social Media
5. **Toggle active status** to enable/disable SEO
6. **Bulk import** SEO from CSV/JSON

### Example Admin Component:

```typescript
'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '~/convex/_generated/api';

export function SeoManagementPage() {
  const seoEntries = useQuery(api.seoMetadata.listAllSeo);
  const upsertSeo = useMutation(api.seoMetadata.upsertSeoMetadata);
  
  const handleCreateSeo = async (data: any) => {
    await upsertSeo(data);
  };
  
  return (
    <div>
      <h1>SEO Management</h1>
      {/* Form to create/edit SEO */}
      {/* Table showing all SEO entries */}
      {/* Preview cards for Google/Twitter/Facebook */}
    </div>
  );
}
```

## Page Path Patterns

You can use these patterns for `pagePath`:

- **Static pages**: `/`, `/about`, `/contact`
- **Dynamic pages**: `/blog/[slug]`, `/products/[id]`
- **Nested routes**: `/blog/category/[category]`
- **Catch-all**: `/docs/[...slug]`

The system will match exact paths first, then fall back to pattern matching.

## Sitemap Generation

Use the `getActiveSeo` query to generate your sitemap:

```typescript
// app/sitemap.ts
import { fetchConvexQuery } from '@/lib/convex-server';
import { api } from '~/convex/_generated/api';

export default async function sitemap() {
  const seoEntries = await fetchConvexQuery(api.seoMetadata.getActiveSeo);
  
  return seoEntries.map((entry) => ({
    url: `https://yourdomain.com${entry.pagePath}`,
    lastModified: new Date(entry.updatedAt),
    changeFrequency: entry.changeFrequency || 'weekly',
    priority: entry.priority || 0.5,
  }));
}
```

## Best Practices

1. **Always provide fallback metadata** in case SEO data isn't found
2. **Use descriptive page paths** that match your routing structure
3. **Test OG images** with [OpenGraph.xyz](https://www.opengraph.xyz/)
4. **Keep descriptions** between 150-160 characters
5. **Use unique titles** for each page
6. **Update `updatedAt`** when content changes significantly
7. **Monitor with Google Search Console**

## Future Enhancements

- [ ] AI-powered SEO suggestions
- [ ] Automatic schema.org markup generation
- [ ] SEO score calculator
- [ ] Competitor analysis
- [ ] Keyword tracking integration
- [ ] A/B testing for titles/descriptions

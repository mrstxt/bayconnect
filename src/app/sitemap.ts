import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getAllPostSlugs } from "@/lib/queries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/experts`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/transfer`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/community`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/hotels`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // DB mavjud bo'lmasa sitemap baribir qaytsin (build yiqilmasin).
  try {
    const slugs = await getAllPostSlugs();
    return [
      ...staticRoutes,
      ...slugs.map((slug) => ({
        url: `${base}/blog/${slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}

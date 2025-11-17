import type { MetadataRoute } from "next";
import { servicesData, locationsData, propertyTypesData } from "@/data";
import { fetchArticles } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.1031exchangeseattle.com";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/property-types`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = servicesData.map((service) => ({
    url: `${baseUrl}${service.route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const locationRoutes: MetadataRoute.Sitemap = locationsData.map((location) => ({
    url: `${baseUrl}${location.route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const propertyTypeRoutes: MetadataRoute.Sitemap = propertyTypesData.map((type) => ({
    url: `${baseUrl}${type.route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const { articles } = await fetchArticles(1, 100);
  const blogRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug.current}`,
    lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(article.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...locationRoutes,
    ...propertyTypeRoutes,
    ...blogRoutes,
  ];
}


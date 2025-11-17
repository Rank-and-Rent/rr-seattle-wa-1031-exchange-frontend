import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION || "2023-01-01";

const enabled = Boolean(projectId && dataset);

const client = enabled
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

type Article = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  featuredImage?: {
    image?: {
      asset: { url: string };
    };
    alt?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readingTime?: number;
};

export type ArticlePreview = Article;

export interface ArticleDetail extends Article {
  content: any; // PortableText content from Sanity
  author?: {
    name?: string;
  };
}

const articleFields = `_id, title, "slug": slug, excerpt, featuredImage, publishedAt, updatedAt, readingTime, author->{ name }`;

export async function fetchArticles(page: number, limit: number) {
  if (!client) {
    return { articles: [] as ArticlePreview[], total: 0 };
  }

  const start = (page - 1) * limit;
  const query = `{
    "articles": *[_type == "article" && published == true] | order(publishedAt desc) [${start}...${start + limit}] {
      ${articleFields}
    },
    "total": count(*[_type == "article" && published == true])
  }`;

  const result = await client.fetch<{ articles: ArticlePreview[]; total: number }>(
    query
  );

  return result;
}

export async function fetchArticleBySlug(slug: string) {
  if (!client) {
    return null;
  }

  const query = `*[_type == "article" && slug.current == $slug && published == true][0] {
    ${articleFields},
    content
  }`;

  const article = await client.fetch<ArticleDetail | null>(query, { slug });
  return article;
}

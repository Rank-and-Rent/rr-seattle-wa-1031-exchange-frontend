import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { fetchArticleBySlug, fetchArticles, type ArticleDetail } from "@/lib/sanity";
import { Breadcrumbs, buildBreadcrumbJsonLd } from "@/components/ui/breadcrumbs";
import { ContactForm } from "@/components/forms/contact-form";
import site from "@/content/site.json";

const components: PortableTextComponents = {
  types: {},
  block: {
    h2: ({ children }) => (
      <h2 className="mt-8 font-heading text-2xl font-semibold text-[#1F3C58]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 font-heading text-xl font-semibold text-[#1F3C58]">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mt-4 text-base leading-7 text-[#1B1B1B]/82">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-[#1B1B1B]/78">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm text-[#1B1B1B]/78">
        {children}
      </ol>
    ),
  },
};

export async function generateStaticParams() {
  const { articles } = await fetchArticles(1, 100);
  return articles.map((article) => ({ slug: article.slug.current }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) {
    return {};
  }
  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `https://www.1031exchangeseattle.com/blog/${slug}`,
    },
  };
}

const jsonSafe = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

const buildArticleJsonLd = (article: ArticleDetail, slug: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.excerpt,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt || article.publishedAt,
  author: article.author?.name
    ? {
        "@type": "Person",
        name: article.author.name,
      }
    : undefined,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `https://www.1031exchangeseattle.com/blog/${slug}`,
  },
  publisher: {
    "@type": "Organization",
    name: site.company,
    url: "https://www.1031exchangeseattle.com/",
  },
});

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "https://www.1031exchangeseattle.com/" },
    { label: "Blog", href: "https://www.1031exchangeseattle.com/blog" },
    {
      label: article.title,
      href: `https://www.1031exchangeseattle.com/blog/${slug}`,
    },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);
  const articleJsonLd = buildArticleJsonLd(article, slug);

  return (
    <div className="bg-[#F5F7FA]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonSafe(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonSafe(articleJsonLd) }}
      />
      <div className="mx-auto max-w-wrapper px-6 pt-12 md:px-10">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <article className="mx-auto max-w-3xl px-6 pb-24 pt-12 md:px-10 md:pb-32">
        <header className="rounded-3xl border border-[#1F3C58]/10 bg-white p-8 shadow-[0_28px_52px_-32px_rgba(17,40,60,0.3)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4DA49B]">
            {format(new Date(article.publishedAt), "MMMM d, yyyy")}
          </p>
          <h1 className="mt-4 font-heading text-3xl font-semibold text-[#1F3C58] sm:text-4xl">
            {article.title}
          </h1>
          {article.author?.name && (
            <p className="mt-2 text-sm text-[#1B1B1B]/70">By {article.author.name}</p>
          )}
          <p className="mt-4 text-base leading-7 text-[#1B1B1B]/80">{article.excerpt}</p>
        </header>
        <div className="mt-8 space-y-6 rounded-3xl border border-[#1F3C58]/10 bg-white p-8 shadow-[0_28px_52px_-32px_rgba(17,40,60,0.24)]">
          <PortableText value={article.content} components={components} />
        </div>
        <section className="mt-12 rounded-3xl border border-[#1F3C58]/10 bg-white p-8 shadow-[0_26px_50px_-30px_rgba(17,40,60,0.3)]">
          <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">
            Start Your 1031 Exchange Review
          </h2>
          <p className="mt-2 text-sm text-[#1B1B1B]/75">
            Share your project type, timeline, and replacement goals. We respond within one business day.
          </p>
          <div className="mt-6">
            <ContactForm source={`Blog article: ${article.title}`} defaultProjectType="Seattle replacement property" id="blog-article-intake" />
          </div>
        </section>
      </article>
    </div>
  );
}

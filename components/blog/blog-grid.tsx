"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import type { ArticlePreview } from "@/lib/sanity";

interface BlogGridProps {
  articles: ArticlePreview[];
}

export const BlogGrid = ({ articles }: BlogGridProps) => {
  const [visibleCount, setVisibleCount] = useState(Math.min(6, articles.length));

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setVisibleCount(mq.matches ? Math.min(3, articles.length) : Math.min(6, articles.length));
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [articles.length]);

  if (!articles.length) {
    return null;
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.slice(0, visibleCount).map((article) => (
        <article
          key={article._id}
          className="flex h-full flex-col rounded-3xl border border-[#1F3C58]/12 bg-white p-6 shadow-[0_22px_44px_-28px_rgba(17,40,60,0.26)]"
        >
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#4DA49B]">
              {format(new Date(article.publishedAt), "MMMM d, yyyy")}
            </p>
            <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">
              {article.title}
            </h2>
            <p className="text-sm text-[#1B1B1B]/75">{article.excerpt}</p>
          </div>
          <div className="mt-auto pt-6">
            <Link
              href={`/blog/${article.slug.current}`}
              className="inline-flex rounded-full border border-[#1F3C58] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1F3C58] hover:bg-[#1F3C58] hover:text-[#F5F7FA]"
            >
              Read Insight
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
};

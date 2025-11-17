import type { Metadata } from 'next';
import Link from 'next/link';
import { CANONICAL_URL } from '@/lib/config';
import site from '@/content/site.json';

export const metadata: Metadata = {
  title: '1031 Exchange Blog | Real Estate Investment Insights',
  description: 'Stay informed about 1031 exchanges, real estate investment strategies, and tax-deferred property exchanges.',
  openGraph: {
    title: '1031 Exchange Blog',
    description: 'Real estate investment insights and 1031 exchange strategies.',
    url: `${CANONICAL_URL}blog/`,
    siteName: site.company,
  },
  alternates: {
    canonical: `${CANONICAL_URL}blog/`,
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1B1B1B]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1F3C58] mb-4">1031 Exchange Blog</h1>
          <p className="text-lg text-[#1B1B1B]/80 max-w-3xl mx-auto">
            Insights, strategies, and updates on tax-deferred real estate exchanges and investment opportunities.
          </p>
        </div>

        <div className="text-center py-12">
          <p className="text-[#1B1B1B]/70">Blog content coming soon. Check back for updates on 1031 exchange strategies and market insights.</p>
        </div>
      </div>
    </div>
  );
}

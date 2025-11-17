import type { Metadata } from 'next';
import { CANONICAL_URL } from '@/lib/config';
import site from '@/content/site.json';

export const metadata: Metadata = {
  title: 'Terms of Service | 1031 Exchange Seattle',
  description: 'Terms of service for 1031 Exchange Seattle.',
  alternates: {
    canonical: `${CANONICAL_URL}terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1B1B1B]">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        <h1 className="text-4xl font-bold text-[#1F3C58] mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-none space-y-6 text-[#1B1B1B]/80">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="text-2xl font-semibold text-[#1F3C58] mb-4">Acceptance of Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#1F3C58] mb-4">Educational Content</h2>
            <p>All content on this website is for educational purposes only and does not constitute tax, legal, or investment advice. You should consult with qualified professionals before making any decisions.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#1F3C58] mb-4">No Guarantees</h2>
            <p>We do not guarantee any specific outcomes or results from the use of our services or information provided on this website.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#1F3C58] mb-4">Contact Us</h2>
            <p>If you have questions about these terms, please contact us at {site.email}.</p>
          </section>
        </div>
      </div>
    </div>
  );
}


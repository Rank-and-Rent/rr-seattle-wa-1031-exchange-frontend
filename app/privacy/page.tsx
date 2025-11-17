import type { Metadata } from 'next';
import { CANONICAL_URL } from '@/lib/config';
import site from '@/content/site.json';

export const metadata: Metadata = {
  title: 'Privacy Policy | 1031 Exchange Seattle',
  description: 'Privacy policy for 1031 Exchange Seattle.',
  alternates: {
    canonical: `${CANONICAL_URL}privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1B1B1B]">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        <h1 className="text-4xl font-bold text-[#1F3C58] mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none space-y-6 text-[#1B1B1B]/80">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="text-2xl font-semibold text-[#1F3C58] mb-4">Information We Collect</h2>
            <p>We collect information that you provide directly to us, including name, email address, phone number, and project details when you submit a contact form or request information about our services.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#1F3C58] mb-4">How We Use Your Information</h2>
            <p>We use the information we collect to respond to your inquiries, provide our services, and communicate with you about 1031 exchange opportunities.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#1F3C58] mb-4">Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#1F3C58] mb-4">Contact Us</h2>
            <p>If you have questions about this privacy policy, please contact us at {site.email}.</p>
          </section>
        </div>
      </div>
    </div>
  );
}


import { Metadata } from 'next';
import { Testimonials } from '@/components/landing/testimonials';

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'Hear from our users about their experiences with ColabBoard.',
};

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold text-white text-center mb-16">What Our Users Say</h1>
        <Testimonials />
      </div>
    </div>
  );
}

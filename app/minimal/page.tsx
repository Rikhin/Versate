// Simple minimal page to test deployment
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Minimal Test Page',
  description: 'A minimal test page for deployment',
};

export default function MinimalPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Minimal Test Page</h1>
        <p className="text-gray-600 mb-6">
          This is a minimal test page to verify successful deployment.
        </p>
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
          <p className="font-bold">Success!</p>
          <p>If you can see this page, the deployment was successful.</p>
        </div>
      </div>
    </div>
  );
}

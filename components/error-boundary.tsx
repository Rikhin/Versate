'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  isNotFound?: boolean;
}

export default function ErrorBoundary({ error, reset, isNotFound = false }: ErrorBoundaryProps) {
  const router = useRouter();

  useEffect(() => {
    console.error('ErrorBoundary caught an error:', error);
  }, [error]);

  if (isNotFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="space-y-4 max-w-md">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="pt-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
            >
              ← Go back home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          An unexpected error occurred. Please try again later.
        </p>
        <div className="pt-4 flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}

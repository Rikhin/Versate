"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import { captureError } from "@/lib/error-handler";

// Component that will throw an error
function ErrorButton() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    // This will be caught by the error boundary
    throw new Error("This is a test error from ErrorButton");
  }

  return (
    <Button 
      onClick={() => setShouldError(true)}
      variant="destructive"
      className="mt-4"
    >
      Trigger Component Error
    </Button>
  );
}

export default function ErrorBoundaryTest() {
  const [asyncError, setAsyncError] = useState<Error | null>(null);
  const [networkError, setNetworkError] = useState<Error | null>(null);

  const triggerAsyncError = async () => {
    try {
      // Simulate an async operation that fails
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("This is a test async error"));
        }, 100);
      });
    } catch (error) {
      setAsyncError(error as Error);
      captureError(error, {
        tags: { test: "async-error" },
        extra: { source: "error-boundary-test-page" }
      });
    }
  };

  const triggerNetworkError = async () => {
    try {
      // This will fail because the endpoint doesn't exist
      const response = await fetch("/api/non-existent-endpoint");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
    } catch (error) {
      setNetworkError(error as Error);
      captureError(error, {
        tags: { test: "network-error" },
        extra: { source: "error-boundary-test-page" }
      });
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Error Boundary Test</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300">
        This page helps test error boundaries and error reporting. Errors will be captured by Sentry in production.
      </p>

      <div className="space-y-8">
        {/* Test 1: Component Error */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">1. Component Error</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Click the button to trigger a React component error that will be caught by the error boundary.
          </p>
          <ErrorButton />
        </div>

        {/* Test 2: Async Error */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">2. Async Error</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Click the button to trigger an error in an async function.
          </p>
          <Button 
            onClick={triggerAsyncError}
            variant="outline"
            className="mt-2"
          >
            Trigger Async Error
          </Button>
          {asyncError && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Caught error: {asyncError.message}</span>
              </div>
            </div>
          )}
        </div>

        {/* Test 3: Network Error */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">3. Network Error</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Click the button to trigger a failed network request.
          </p>
          <Button 
            onClick={triggerNetworkError}
            variant="outline"
            className="mt-2"
          >
            Trigger Network Error
          </Button>
          {networkError && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Network error: {networkError.message}</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              After testing, check your Sentry dashboard to verify that errors are being captured correctly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <a href="/" className="flex items-center">
                  Return to Home
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a 
                  href="https://sentry.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  Open Sentry Dashboard
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

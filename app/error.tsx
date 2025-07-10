'use client';

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import * as Sentry from "@sentry/nextjs"
import { Button } from "@/components/ui/button"
import { AlertCircle, Home, RefreshCw, ExternalLink, Mail } from "lucide-react"
import Link from "next/link"

type ErrorType = Error & { 
  digest?: string;
  statusCode?: number;
  message: string;
}

export default function Error({
  error,
  reset,
}: {
  error: ErrorType;
  reset: () => void;
}) {
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();
  
  // Extract status code if available
  const statusCode = 'statusCode' in error ? (error as any).statusCode : 500;
  const errorMessage = error.message || 'An unexpected error occurred';
  
  // Log error to Sentry
  useEffect(() => {
    console.error('Error Boundary:', {
      message: errorMessage,
      stack: error.stack,
      digest: error.digest,
      statusCode
    });
    
    // Capture the error with Sentry
    Sentry.captureException(error, {
      tags: {
        error_boundary: true,
        status_code: statusCode,
      },
      extra: {
        error_message: errorMessage,
        error_digest: error.digest,
        error_stack: error.stack,
      },
    });
    
    // Return a cleanup function to flush events
    return () => {
      // Sentry.flush is available in the latest SDK for client-side flushing
      if (typeof Sentry.flush === 'function') {
        Sentry.flush(2000);
      }
    };
  }, [error, errorMessage, statusCode]);
  
  const handleReset = () => {
    setIsResetting(true);
    try {
      reset();
    } finally {
      setTimeout(() => setIsResetting(false), 1000);
    }
  };
  
  const getErrorMessage = () => {
    if (statusCode === 404) {
      return "The page you're looking for doesn't exist or has been moved.";
    }
    if (statusCode === 401 || statusCode === 403) {
      return "You don't have permission to view this page.";
    }
    return errorMessage || "We encountered an unexpected error while loading the page.";
  };
  
  const getErrorTitle = () => {
    if (statusCode === 404) return "Page Not Found";
    if (statusCode === 401) return "Unauthorized";
    if (statusCode === 403) return "Access Denied";
    if (statusCode === 500) return "Internal Server Error";
    return "Something went wrong";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-helix-dark to-helix-darker flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
          <AlertCircle className="h-10 w-10 text-red-400" />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          {statusCode ? `${statusCode}: ` : ''}{getErrorTitle()}
        </h1>
        
        <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
          {getErrorMessage()}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleReset}
            disabled={isResetting}
            className="bg-helix-gradient-start hover:bg-helix-gradient-end text-white px-6 py-3 text-base font-medium rounded-lg transition-colors"
          >
            {isResetting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </>
            )}
          </Button>
          
          <Button 
            asChild
            variant="outline"
            className="border-gray-600 text-gray-200 hover:bg-gray-800 px-6 py-3 text-base font-medium rounded-lg transition-colors"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 mb-4">Need help? Contact our support team</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="sm" className="text-gray-400 border-gray-700 hover:bg-gray-800">
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </Button>
            <Button variant="outline" size="sm" className="text-gray-400 border-gray-700 hover:bg-gray-800">
              <ExternalLink className="w-4 h-4 mr-2" />
              Help Center
            </Button>
          </div>
        </div>
        
        {/* Error details for development */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 p-4 bg-black/20 rounded-lg text-left">
            <summary className="text-sm font-medium text-gray-400 cursor-pointer">
              Error Details (Development Only)
            </summary>
            <div className="mt-2 p-3 bg-black/30 rounded text-xs font-mono text-red-300 overflow-x-auto">
              <div>Message: {error.message}</div>
              {error.digest && <div>Digest: {error.digest}</div>}
              {statusCode && <div>Status Code: {statusCode}</div>}
              {error.stack && (
                <div className="mt-2">
                  <div>Stack Trace:</div>
                  <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

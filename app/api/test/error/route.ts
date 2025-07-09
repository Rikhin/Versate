import { NextResponse } from 'next/server';
import { captureError } from '@/lib/error-handler';

export async function GET() {
  try {
    // Simulate an error
    throw new Error('This is a test error from the API route');
    
    return NextResponse.json({ message: 'This will not be reached' });
  } catch (error) {
    // Capture the error with Sentry
    captureError(error, {
      tags: { api: 'test-error' },
      extra: { source: 'test-error-api-route' }
    });
    
    // Return a proper error response
    return NextResponse.json(
      { error: 'Test error occurred', message: error.message },
      { status: 500 }
    );
  }
}

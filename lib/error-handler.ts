import * as Sentry from '@sentry/nextjs';

type ErrorContext = {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  user?: {
    id?: string;
    email?: string;
  };
};

export function captureError(error: unknown, context: ErrorContext = {}) {
  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Captured error:', error);
    if (context.extra) {
      console.error('Error context:', context.extra);
    }
  }

  // Only report to Sentry in production
  if (process.env.NODE_ENV === 'production') {
    // Set user context if available
    if (context.user) {
      Sentry.setUser({
        id: context.user.id,
        email: context.user.email,
      });
    }

    // Set tags and extra data
    if (context.tags) {
      Sentry.setTags(context.tags);
    }

    // Capture the error
    if (error instanceof Error) {
      Sentry.captureException(error, {
        extra: context.extra,
      });
    } else if (typeof error === 'string') {
      Sentry.captureMessage(error, {
        level: 'error',
        extra: context.extra,
      });
    } else {
      Sentry.captureException(new Error('Unknown error occurred'), {
        extra: {
          originalError: error,
          ...context.extra,
        },
      });
    }
  }
}

export function withErrorHandler<T extends (...args: any[]) => any>(
  fn: T,
  context?: Omit<ErrorContext, 'extra'>
): (...args: Parameters<T>) => ReturnType<T> | Promise<ReturnType<T>> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureError(error, {
        ...context,
        extra: {
          functionName: fn.name || 'anonymous',
          args: JSON.parse(JSON.stringify(args)),
          ...context?.extra,
        },
      });
      throw error; // Re-throw to allow error boundaries to catch it
    }
  };
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(message, level);
  } else {
    console[level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log'](message);
  }
}

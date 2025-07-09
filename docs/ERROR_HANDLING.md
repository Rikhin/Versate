# Error Handling & Monitoring

This document outlines the error handling patterns and monitoring setup for the application.

## Sentry Integration

### Setup

1. **Environment Variables**
   Add these to your `.env.local` file:
   ```
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
   SENTRY_AUTH_TOKEN=your_sentry_auth_token
   SENTRY_ORG=your_sentry_org
   SENTRY_PROJECT=your_sentry_project
   ```

2. **Sentry Configuration**
   - `sentry.client.config.js`: Client-side configuration
   - `sentry.server.config.js`: Server-side configuration

### Error Handling Utilities

#### `captureError`
```typescript
import { captureError } from '@/lib/error-handler';

try {
  // Your code here
} catch (error) {
  captureError(error, {
    tags: { component: 'YourComponent' },
    extra: { /* additional context */ },
    user: { id: 'user123', email: 'user@example.com' }
  });
}
```

#### `withErrorHandler` (Higher-Order Function)
```typescript
import { withErrorHandler } from '@/lib/error-handler';

const fetchData = withErrorHandler(async (id: string) => {
  const response = await fetch(`/api/data/${id}`);
  return response.json();
}, { tags: { feature: 'data-fetching' } });
```

#### `captureMessage`
```typescript
import { captureMessage } from '@/lib/error-handler';

// For important events
captureMessage('User performed critical action', 'info');

// For warnings
captureMessage('Potential performance issue detected', 'warning');

// For errors
captureMessage('Failed to load user data', 'error');
```

## Error Boundaries

Use the built-in error boundary in `app/error.tsx` which automatically captures errors with Sentry.

## Testing Error Reporting

1. **Development**
   - Errors are logged to console
   - Check browser console for error details

2. **Production**
   - Errors are sent to Sentry
   - Check your Sentry dashboard for reports

## Best Practices

1. Always provide context with errors
2. Use appropriate error levels
3. Don't log sensitive information
4. Handle expected errors gracefully
5. Use error boundaries for UI components

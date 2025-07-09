# Deployment Guide

This guide covers the deployment process for the application, including Sentry integration for error tracking and performance monitoring.

## Prerequisites

- Node.js 16+ and npm/yarn
- Vercel CLI (`npm install -g vercel`)
- Sentry account (https://sentry.io)

## Environment Setup

### 1. Sentry Configuration

1. Create a new project in your Sentry dashboard
2. Navigate to Project Settings > Client Keys (DSN)
3. Copy your DSN (it will look like `https://<key>@<organization>.ingest.sentry.io/<project>`)

### 2. Vercel Environment Variables

Add the following environment variables to your Vercel project:

```
# Required
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_AUTH_TOKEN=your_sentry_auth_token
SENTRY_ORG=your_sentry_org_slug
SENTRY_PROJECT=your_sentry_project_slug

# Optional
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
```

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env.local` file with your local environment variables
4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Building for Production

To build the application for production:

```bash
# Build the application
npm run build
# or
yarn build

# Start the production server
npm start
# or
yarn start
```

## CI/CD Deployment

The project includes a Sentry release script (`scripts/sentry-release.sh`) that can be integrated into your CI/CD pipeline.

### GitHub Actions Example

```yaml
name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16.x'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
          SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
      
      - name: Create Sentry release
        run: bash scripts/sentry-release.sh
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
          SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
          VERCEL_ENV: ${{ github.ref == 'refs/heads/main' && 'production' || 'preview' }}
```

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Link your project:
   ```bash
   vercel link
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

## Verifying the Deployment

After deployment:

1. Visit your deployed URL
2. Navigate to `/test/error-boundary`
3. Test the error scenarios
4. Check your Sentry dashboard to verify errors are being captured

## Troubleshooting

### Source Maps Not Working
- Verify the `url_prefix` in `sentry.properties` matches your deployment URL structure
- Check that source maps are being uploaded during the build process
- Ensure the `SENTRY_RELEASE` environment variable is set correctly

### Errors Not Appearing in Sentry
- Verify your DSN is correct
- Check that the environment is set correctly
- Ensure the user has the necessary permissions in Sentry

## Monitoring

After deployment, monitor:

1. **Error Rates** in the Sentry dashboard
2. **Performance Metrics** for API routes and page loads
3. **Release Health** to track crash rates and user impact

## Rollback Procedure

To rollback to a previous version:

1. Revert to the previous Git commit
2. Rebuild and redeploy
3. Use Vercel's rollback feature if needed

## Support

For assistance with deployment, contact the development team or refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Sentry Documentation](https://docs.sentry.io/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

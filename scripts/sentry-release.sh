#!/bin/bash
set -e

# Exit if not in CI environment
if [ -z "$CI" ]; then
  echo "This script is intended to run in CI environment"
  exit 1
fi

# Check for required environment variables
if [ -z "$SENTRY_AUTH_TOKEN" ] || [ -z "$SENTRY_ORG" ] || [ -z "$SENTRY_PROJECT" ]; then
  echo "Error: Missing required environment variables"
  echo "Make sure SENTRY_AUTH_TOKEN, SENTRY_ORG, and SENTRY_PROJECT are set"
  exit 1
fi

# Install Sentry CLI if not already installed
if ! command -v sentry-cli &> /dev/null; then
  echo "Installing Sentry CLI..."
  curl -sL https://sentry.io/get-cli/ | bash
fi

# Set environment
if [ "$VERCEL_ENV" = "production" ]; then
  ENV="production"
else
  ENV="staging"
fi

# Generate a release name (timestamp + git SHA)
RELEASE="$ENV-$(date +%Y%m%d%H%M%S)-$(git rev-parse --short HEAD)"

echo "Creating Sentry release $RELEASE..."

# Create a new release
sentry-cli releases new "$RELEASE" \
  --project "$SENTRY_PROJECT" \
  --finalize \
  --environment "$ENV"

# Upload source maps
sentry-cli releases files "$RELEASE" \
  upload-sourcemaps .next \
  --url-prefix '~/_next' \
  --rewrite

# Associate commits with the release
sentry-cli releases set-commits "$RELEASE" --auto

# Finalize the release
sentry-cli releases finalize "$RELEASE"

echo "Sentry release $RELEASE created and finalized"

# Output the release name for use in deployment
# This can be used to set the SENTRY_RELEASE environment variable
echo "SENTRY_RELEASE=$RELEASE" >> $GITHUB_ENV

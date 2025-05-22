#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Print commands and their arguments as they are executed
set -x

# Set environment to production
export NODE_ENV=production

# Clean any previous builds
echo "Cleaning previous builds..."
rm -rf .next

# Set max memory for Node.js
echo "Setting node options..."
export NODE_OPTIONS="--max-old-space-size=4096"

# Build Next.js app
echo "Building Next.js app..."
npx next build

# Output success message
echo "✅ Build completed successfully!"

# Exit with success status
exit 0 
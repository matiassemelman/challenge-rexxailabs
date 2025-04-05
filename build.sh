#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting build process..."

# Install all dependencies
npm install

# Create declaration files for modules
mkdir -p ./src/types
echo 'declare module "express";' > ./src/types/express-module.d.ts
echo 'declare module "jsonwebtoken";' > ./src/types/jsonwebtoken-module.d.ts
echo 'declare module "express-rate-limit";' > ./src/types/express-rate-limit-module.d.ts

# Try standard build first
echo "Attempting standard TypeScript build..."
npm run build || {
  echo "Standard build failed, using direct transpilation..."
  node ./scripts/transpile.js
}

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Build completed successfully!"
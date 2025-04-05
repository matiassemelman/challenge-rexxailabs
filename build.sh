#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
npm install

# Install type definitions explicitly
npm install --save-dev @types/express@5.0.1 @types/jsonwebtoken@9.0.9

# Build the project
npm run build

# Generate Prisma client
npx prisma generate

# Optional: run database migrations (uncomment if needed)
# npx prisma migrate deploy
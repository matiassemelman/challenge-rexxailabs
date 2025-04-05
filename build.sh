#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

# Generate Prisma client
npx prisma generate

# Optional: run database migrations (uncomment if needed)
# npx prisma migrate deploy
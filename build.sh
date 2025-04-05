#!/usr/bin/env bash
# exit on error
set -o errexit

# Install all dependencies (including types)
npm install

# Create a simple module declaration file for Express
mkdir -p ./src/types
echo 'declare module "express";' > ./src/types/express-module.d.ts
echo 'declare module "jsonwebtoken";' > ./src/types/jsonwebtoken-module.d.ts
echo 'declare module "express-rate-limit";' > ./src/types/express-rate-limit-module.d.ts

# Build the project with less strict configuration
npm run build

# Generate Prisma client
npx prisma generate
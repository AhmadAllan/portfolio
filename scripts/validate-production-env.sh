#!/bin/bash

# Validate Production Environment Configuration
# This script checks for placeholder values in production environment files
# Run this in CI/CD before deploying to production

set -e

ERRORS=0

echo "Validating production environment configuration..."

# Check frontend production environment
ENV_FILE="apps/web/src/environments/environment.ts"

if [ -f "$ENV_FILE" ]; then
  echo "Checking $ENV_FILE..."

  if grep -q "your-production-domain" "$ENV_FILE"; then
    echo "ERROR: $ENV_FILE contains placeholder 'your-production-domain'"
    ERRORS=$((ERRORS + 1))
  fi

  if grep -q "your-domain" "$ENV_FILE"; then
    echo "ERROR: $ENV_FILE contains placeholder 'your-domain'"
    ERRORS=$((ERRORS + 1))
  fi

  if grep -q "localhost" "$ENV_FILE"; then
    echo "WARNING: $ENV_FILE contains 'localhost' - ensure this is intentional for production"
  fi
else
  echo "WARNING: $ENV_FILE not found"
fi

# Check backend .env file (if exists in CI context)
if [ -f ".env" ]; then
  echo "Checking .env..."

  if grep -q "your_db" ".env"; then
    echo "ERROR: .env contains placeholder database credentials"
    ERRORS=$((ERRORS + 1))
  fi

  if grep -q "your-secret" ".env"; then
    echo "ERROR: .env contains placeholder JWT secrets"
    ERRORS=$((ERRORS + 1))
  fi

  if grep -q "change-in-production" ".env"; then
    echo "ERROR: .env contains 'change-in-production' placeholder"
    ERRORS=$((ERRORS + 1))
  fi
fi

# Summary
echo ""
if [ $ERRORS -gt 0 ]; then
  echo "FAILED: Found $ERRORS placeholder value(s) in production configuration"
  echo "Please replace all placeholder values before deploying to production"
  exit 1
else
  echo "PASSED: No placeholder values found in production configuration"
  exit 0
fi

#!/bin/bash

echo "🚀 Setting up mentors database..."

# Step 1: Create mentors table
echo "📋 Creating mentors table..."
psql $DATABASE_URL -f scripts/create-mentors-table.sql

# Step 2: Import mentors data
echo "📥 Importing mentors from CSV files..."
node scripts/import-mentors.js

echo "✅ Setup complete!" 
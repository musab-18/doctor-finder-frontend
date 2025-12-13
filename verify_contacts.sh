#!/bin/bash

echo "=========================================="
echo "Verifying Contacts Table and Data"
echo "=========================================="
echo ""

# Check if backend is running
if ! lsof -ti:3001 > /dev/null 2>&1; then
    echo "❌ Backend is NOT running on port 3001"
    echo "   Please start it: cd backend/backend && npm run start:dev"
    exit 1
fi

echo "✅ Backend is running on port 3001"
echo ""

# Test API endpoint
echo "Testing contact form API..."
RESPONSE=$(curl -s -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"Verification Test","email":"verify@test.com","subject":"Database Check","message":"This is a test to verify data is being saved"}')

if echo "$RESPONSE" | grep -q "id"; then
    echo "✅ API is working! Data is being saved."
    echo "Response: $RESPONSE"
    echo ""
    echo "=========================================="
    echo "Next Steps to View Data in Database:"
    echo "=========================================="
    echo ""
    echo "1. Open pgAdmin 4"
    echo "2. Connect to: localhost:5432"
    echo "   Username: postgres"
    echo "   Password: 098765"
    echo "3. Navigate to: doctor_finder → Schemas → public → Tables → contacts"
    echo "4. Right-click 'contacts' → View/Edit Data → All Rows"
    echo ""
    echo "OR run this SQL query in pgAdmin:"
    echo "   SELECT * FROM contacts ORDER BY \"createdAt\" DESC;"
else
    echo "❌ API test failed"
    echo "Response: $RESPONSE"
fi









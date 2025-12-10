#!/bin/bash
# Script to check contacts table in PostgreSQL

echo "=========================================="
echo "Checking Contacts Table in PostgreSQL"
echo "=========================================="
echo ""
echo "Database: doctor_finder"
echo "Table: contacts"
echo ""
echo "To check the database, you can:"
echo ""
echo "1. Using pgAdmin 4:"
echo "   - Open pgAdmin 4"
echo "   - Connect to your PostgreSQL server"
echo "   - Navigate to: Servers > PostgreSQL > Databases > doctor_finder > Schemas > public > Tables > contacts"
echo "   - Right-click on 'contacts' > View/Edit Data > All Rows"
echo ""
echo "2. Using psql command line:"
echo "   psql -U postgres -d doctor_finder -c 'SELECT * FROM contacts ORDER BY \"createdAt\" DESC;'"
echo ""
echo "3. Using the SQL file:"
echo "   Open CHECK_CONTACTS_TABLE.sql and run the queries"
echo ""
echo "=========================================="
echo "Quick Test - Checking if API is working:"
echo "=========================================="
curl -s -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Check","email":"test@check.com","subject":"Database Test","message":"Testing if data is saved"}' | jq .
echo ""
echo "If you see a response with an ID, the data is being saved!"

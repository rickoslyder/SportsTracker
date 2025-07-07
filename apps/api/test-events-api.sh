#!/bin/bash

# Test script for event API endpoints
API_URL="http://localhost:3003/api"
ADMIN_KEY="3ddd229b4318075a838d8763fb6821a431e6d83854ebfadbe6f5e68c0bddee00"

echo "Testing Event API Endpoints"
echo "=========================="

# Test 1: List all events
echo -e "\n1. Listing all events (public endpoint):"
curl -s "${API_URL}/events?limit=5" | jq '.'

# Test 2: Get specific event (if exists)
echo -e "\n2. Get specific event:"
EVENT_ID=$(curl -s "${API_URL}/events?limit=1" | jq -r '.events[0].id // empty')
if [ -n "$EVENT_ID" ]; then
  curl -s "${API_URL}/events/${EVENT_ID}" | jq '.'
else
  echo "No events found to test"
fi

# Test 3: Try to update without auth (should fail)
echo -e "\n3. Update event without auth (should fail):"
if [ -n "$EVENT_ID" ]; then
  curl -s -X PUT "${API_URL}/events/${EVENT_ID}" \
    -H "Content-Type: application/json" \
    -d '{"title": "Updated Event"}' | jq '.'
fi

# Test 4: Update with admin API key
echo -e "\n4. Update event with admin API key:"
if [ -n "$EVENT_ID" ]; then
  curl -s -X PUT "${API_URL}/events/${EVENT_ID}" \
    -H "Content-Type: application/json" \
    -H "X-Admin-Api-Key: ${ADMIN_KEY}" \
    -d '{"title": "Updated Event Title", "status": "scheduled"}' | jq '.'
fi

# Test 5: Update event status
echo -e "\n5. Update event status:"
if [ -n "$EVENT_ID" ]; then
  curl -s -X PATCH "${API_URL}/events/${EVENT_ID}/status" \
    -H "Content-Type: application/json" \
    -H "X-Admin-Api-Key: ${ADMIN_KEY}" \
    -d '{"status": "live"}' | jq '.'
fi

# Test 6: Search events
echo -e "\n6. Search events:"
curl -s "${API_URL}/events?search=UFC&limit=5" | jq '.'

# Test 7: Filter by status
echo -e "\n7. Filter by status:"
curl -s "${API_URL}/events?status=scheduled&limit=5" | jq '.'

echo -e "\nTest complete!"
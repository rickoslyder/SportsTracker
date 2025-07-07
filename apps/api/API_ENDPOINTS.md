# Sports Event Tracker API Documentation

## Base URL
- Development: `http://localhost:3003/api`
- Production: `https://api.sportstracker.com/api`

## Authentication
Admin endpoints require authentication via one of:
- `X-Admin-Api-Key` header with admin API key
- `Authorization: Bearer <token>` header with admin token

## Endpoints

### Health Check
- `GET /health` - API health status

### Events

#### Public Endpoints
- `GET /api/events` - List all events
  - Query params: `sport_id`, `status`, `start_date`, `end_date`, `search`, `limit`, `offset`
- `GET /api/events/:id` - Get single event

#### Admin Endpoints
- `PUT /api/events/:id` - Update event
  - Body: `{ title, start_time, end_time, location, venue, status, timezone, metadata }`
- `DELETE /api/events/:id` - Delete event
- `PATCH /api/events/:id/status` - Update event status
  - Body: `{ status: "scheduled" | "live" | "completed" | "cancelled" }`
- `POST /api/events/bulk-update` - Bulk update events
  - Body: `{ ids: [1,2,3], updates: { status: "cancelled" } }`

### Sync

- `GET /api/sync/status` - Get sync status for all sports
- `POST /api/sync/trigger/:sportId` - Trigger manual sync for a sport
- `GET /api/sync/cache/:sportId` - Get recent API cache entries
- `GET /api/sync/logs` - Get sync logs

### Admin Dashboard

- `GET /api/admin/dashboard` - Admin dashboard statistics
- `GET /api/admin/sync-status` - Detailed sync status
- `POST /api/admin/clear-cache/:sportId` - Clear cache for a sport
- `GET /api/admin/admins` - List all admins (super_admin only)
- `PATCH /api/admin/admins/:id` - Update admin (super_admin only)

## Response Formats

### Success Response
```json
{
  "data": {},
  "message": "Success message"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": {} // Optional validation errors
}
```

### Pagination Response
```json
{
  "events": [],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Rate Limiting
- 100 requests per 15 minutes per IP
- Admin endpoints have higher limits

## Example Usage

### List Events
```bash
curl http://localhost:3003/api/events?sport_id=1&status=scheduled&limit=10
```

### Update Event (Admin)
```bash
curl -X PUT http://localhost:3003/api/events/123 \
  -H "X-Admin-Api-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Event Title", "status": "live"}'
```

### Trigger Sync
```bash
curl -X POST http://localhost:3003/api/sync/trigger/1 \
  -H "X-Admin-Api-Key: your-api-key"
```
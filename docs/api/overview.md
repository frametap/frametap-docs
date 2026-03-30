# API Overview

The Frametap API is a RESTful API built on FastAPI that enables programmatic control of runners, jobs, and artifacts.

## Base URL

```
https://api.frametap.io
```

## API Architecture

### Layer Structure

```
┌─────────────────────────────────────┐
│           Delivery Layer            │
│    (Routers, Schemas, Middleware)   │
├─────────────────────────────────────┤
│         Application Layer           │
│     (Services, Use Cases)          │
├─────────────────────────────────────┤
│           Domain Layer              │
│    (Entities, Types, Interfaces)    │
├─────────────────────────────────────┤
│        Infrastructure Layer         │
│   (Repositories, Adapters, DB)      │
└─────────────────────────────────────┘
```

### Request Lifecycle

1. HTTP request arrives at Delivery layer
2. Schema validation (Pydantic models)
3. Authentication/authorization checks
4. Application service executes business logic
5. Infrastructure layer persists to Postgres/Redis
6. Unified response via `ResponseSchema`

## Response Format

All API responses follow a consistent structure:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-03-28T12:00:00Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Job not found",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2026-03-28T12:00:00Z"
  }
}
```

## Authentication

Frametap uses two authentication methods:

### 1. API Keys (Programmatic Access)

For scripts, CI/CD, and automated workflows:

```bash
curl https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer ft_api_xxxxxxxxxxxxxxxxx"
```

### 2. Session Cookies (Web Dashboard)

WorkOS-based authentication for web users:
- Login via `/v1/auth/login`
- Callback via `/v1/auth/callback`
- Logout via `/v1/auth/logout`

## Core Resources

### Runners

Agents that run on your machines to perform captures.

- `POST /v1/runners/register` - Register a new runner
- `GET /v1/runners` - List runners
- `GET /v1/runners/{id}` - Get runner details
- `PATCH /v1/runners/{id}` - Update runner
- `DELETE /v1/runners/{id}` - Terminate runner

### Jobs

Capture and upload tasks.

- `POST /v1/jobs` - Create a job
- `GET /v1/jobs` - List jobs
- `GET /v1/jobs/{id}` - Get job details
- `PATCH /v1/jobs/{id}` - Update job
- `POST /v1/jobs/{id}/cancel` - Cancel job
- `DELETE /v1/jobs/{id}` - Delete job
- `GET /v1/jobs/{id}/events` - Get job events

### Documents

Artifacts produced by jobs (recordings, screenshots, files).

- `GET /v1/documents` - List documents
- `GET /v1/documents/{id}` - Get document
- `PATCH /v1/documents/{id}` - Update document
- `DELETE /v1/documents/{id}` - Delete document
- `GET /v1/documents/files/{id}/url` - Get download URL

### Projects

Organize jobs and documents.

- `POST /v1/projects` - Create project
- `GET /v1/projects` - List projects
- `GET /v1/projects/{id}` - Get project
- `PATCH /v1/projects/{id}` - Update project
- `DELETE /v1/projects/{id}` - Delete project

### API Keys

Manage programmatic access.

- `POST /v1/keys` - Create API key
- `GET /v1/keys` - List keys
- `GET /v1/keys/{id}` - Get key
- `DELETE /v1/keys/{id}` - Delete key

## Common Patterns

### Pagination

List endpoints support cursor-based pagination:

```bash
curl "https://api.frametap.io/v1/jobs?limit=20"

# Next page
curl "https://api.frametap.io/v1/jobs?limit=20&cursor=abc123&direction=next"
```

### Filtering

Filter results with query parameters:

```bash
# Filter by status
curl "https://api.frametap.io/v1/jobs?status=running"

# Filter by type
curl "https://api.frametap.io/v1/jobs?jobType=recording"

# Filter by runner
curl "https://api.frametap.io/v1/jobs?runnerId=123"

# Multiple filters
curl "https://api.frametap.io/v1/jobs?status=completed&jobType=screenshot"
```

### Sorting

Sort results:

```bash
# Sort by creation date
curl "https://api.frametap.io/v1/jobs?sortField=createdAt&sortType=desc"

# Sort by name
curl "https://api.frametap.io/v1/runners?sortField=name&sortType=asc"
```

## Rate Limits

API rate limits are based on your subscription:

| Plan | Rate Limit |
|------|------------|
| Free | 100 requests/minute |
| Dev | 500 requests/minute |
| Pro | 2000 requests/minute |

Rate limit headers:
```
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 499
X-RateLimit-Reset: 1711533600
```

## WebSocket API

Real-time updates via WebSocket:

```javascript
const ws = new WebSocket(
  'wss://api.frametap.io/v1/ws/runners',
  ['frametap-protocol'],
  { headers: { Authorization: 'Bearer ' + token } }
);

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Job update:', message);
};
```

See [WebSocket Protocol](/api/websocket) for details.

## SDKs and Tools

### cURL Examples

All examples in this documentation use cURL:

```bash
curl -X POST https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type":"recording","runnerId":123}'
```

### Python

```python
import requests

class FrametapClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://api.frametap.io'
    
    def create_job(self, job_data):
        return requests.post(
            f'{self.base_url}/v1/jobs',
            headers={'Authorization': f'Bearer {self.api_key}'},
            json=job_data
        ).json()

client = FrametapClient('ft_api_xxx')
job = client.create_job({'type': 'recording', 'runnerId': 123})
```

### JavaScript/TypeScript

```typescript
class FrametapClient {
  constructor(private apiKey: string) {}
  
  async createJob(jobData: any) {
    const response = await fetch('https://api.frametap.io/v1/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jobData)
    });
    return response.json();
  }
}
```

## API Reference

For complete API specification with interactive documentation:

👉 **[Full API Reference](https://frametap.io/api)** (powered by Scalar)

The reference includes:
- All endpoints with request/response schemas
- Authentication details
- Code examples in multiple languages
- Try-it-now functionality

## OpenAPI Specification

Download the OpenAPI spec:

```bash
curl https://api.frametap.io/openapi.json > frametap-openapi.json
```

Or view it at:

- https://api.frametap.io/openapi.json

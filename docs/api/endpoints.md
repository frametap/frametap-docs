# API Endpoints

Complete reference for Frametap API endpoints.

## Base URL

```
https://api.frametap.io/v1
```

## Authentication

All requests require an API key in the Authorization header:

```
Authorization: Bearer ft_api_xxxxxxxxxxxxxxxxx
```

## Runners

### Register Runner

Enroll a new runner with an enrollment token.

```http
POST /v1/runners/register
```

**Request:**
```json
{
  "token": "ft_enrollment_xxxxxxxxxxxxxxxxx",
  "hostname": "my-runner",
  "labels": {
    "runtime": "docker",
    "version": "1.0.0"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "runnerId": 123,
    "runnerToken": "ft_runner_xxxxxxxxxxxx",
    "organizationId": 456
  }
}
```

### List Runners

```http
GET /v1/runners
```

**Query Parameters:**
- `status` - Filter by status (`online`, `offline`, `working`, `ready`)
- `name` - Filter by name (partial match)
- `limit` - Items per page (default: 20)
- `cursor` - Pagination cursor
- `sortField` - Sort field (`name`, `createdAt`, `lastSeenAt`)
- `sortType` - `asc` or `desc`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 123,
        "name": "my-runner",
        "status": "ready",
        "displays": [
          {
            "id": ":0",
            "name": "Display 1",
            "width": 1920,
            "height": 1080,
            "systemDisplay": true
          }
        ],
        "labels": {
          "runtime": "docker",
          "version": "1.0.0",
          "hostname": "my-server",
          "platform": "linux/amd64"
        },
        "lastSeenAt": "2026-03-28T10:00:00Z",
        "createdAt": "2026-03-01T00:00:00Z"
      }
    ],
    "pagination": {
      "cursor": "abc123",
      "hasMore": true
    }
  }
}
```

### Get Runner

```http
GET /v1/runners/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "my-runner",
    "status": "ready",
    "displays": [...],
    "scopes": ["record", "screenshot", "upload"],
    "lastSeenAt": "2026-03-28T10:00:00Z"
  }
}
```

### Update Runner

```http
PATCH /v1/runners/{id}
```

**Request:**
```json
{
  "name": "renamed-runner"
}
```

### Terminate Runner

```http
DELETE /v1/runners/{id}
```

Sets `terminatedAt` timestamp. Runner will be cleaned up after 24 hours.

### Sync Displays

```http
PATCH /v1/runners/{id}/displays
```

Update the list of available displays for a runner.

**Request:**
```json
{
  "displays": [
    {
      "id": ":0",
      "name": "Display 1",
      "width": 1920,
      "height": 1080
    }
  ]
}
```

## Jobs

### Create Job

```http
POST /v1/jobs
```

**Recording Job:**
```json
{
  "runnerId": 123,
  "type": "recording",
  "displayId": ":0",
  "name": "Test Recording",
  "stopCondition": "duration",
  "stopConditionConfig": {
    "durationSeconds": 60
  },
  "projectId": 456,
  "recordAudio": false
}
```

**Screenshot Job:**
```json
{
  "runnerId": 123,
  "type": "screenshot",
  "displayId": ":0",
  "name": "Homepage",
  "projectId": 456
}
```

**File Upload Job:**
```json
{
  "runnerId": 123,
  "type": "file_upload",
  "name": "Artifacts",
  "includePatterns": ["*.png", "*.mp4"],
  "excludePatterns": ["*.tmp"],
  "projectId": 456
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 789,
    "runnerId": 123,
    "type": "recording",
    "status": "queued",
    "name": "Test Recording",
    "createdAt": "2026-03-28T10:00:00Z"
  }
}
```

### List Jobs

```http
GET /v1/jobs
```

**Query Parameters:**
- `status` - `queued`, `running`, `completed`, `failed`, `cancelled`
- `jobType` - `recording`, `screenshot`, `stream`, `file_upload`
- `runnerId` - Filter by runner
- `projectId` - Filter by project
- `createdByUserId` - Filter by creator
- `limit` - Items per page
- `cursor` - Pagination cursor
- `sortField` - `name`, `createdAt`, `updatedAt`, `status`
- `sortType` - `asc` or `desc`

### Get Job

```http
GET /v1/jobs/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 789,
    "runnerId": 123,
    "projectId": 456,
    "type": "recording",
    "status": "completed",
    "name": "Test Recording",
    "stopCondition": "duration",
    "stopConditionConfig": {
      "durationSeconds": 60
    },
    "displayId": ":0",
    "documentId": 999,
    "startedAt": "2026-03-28T10:01:00Z",
    "completedAt": "2026-03-28T10:02:00Z",
    "createdAt": "2026-03-28T10:00:00Z"
  }
}
```

### Update Job

```http
PATCH /v1/jobs/{id}
```

**Request:**
```json
{
  "name": "Renamed Recording"
}
```

### Cancel Job

```http
POST /v1/jobs/{id}/cancel
```

Stops a running job gracefully.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 789,
    "status": "cancelled"
  }
}
```

### Delete Job

```http
DELETE /v1/jobs/{id}
```

### List Job Events

```http
GET /v1/jobs/{id}/events
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "jobId": 789,
        "eventType": "job_started",
        "payload": {},
        "createdAt": "2026-03-28T10:00:01Z"
      },
      {
        "id": 2,
        "jobId": 789,
        "eventType": "recording_started",
        "payload": {
          "displayId": ":0"
        },
        "createdAt": "2026-03-28T10:00:02Z"
      },
      {
        "id": 3,
        "jobId": 789,
        "eventType": "recording_completed",
        "payload": {
          "size": 12345678,
          "duration": 60
        },
        "createdAt": "2026-03-28T10:01:02Z"
      }
    ]
  }
}
```

## Documents

### List Documents

```http
GET /v1/documents
```

**Query Parameters:**
- `type` - `video`, `screenshot`, `stream`, `file`
- `projectId` - Filter by project
- `jobId` - Filter by job
- `status` - `pending`, `ready`, `failed`, `deleted`
- `limit` - Items per page
- `cursor` - Pagination cursor

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 999,
        "type": "video",
        "status": "ready",
        "name": "Test Recording",
        "metadata": {
          "width": 1920,
          "height": 1080,
          "duration": 60,
          "codec": "h264"
        },
        "files": [
          {
            "id": 1000,
            "role": "primary",
            "size": 12345678,
            "contentType": "video/mp4"
          },
          {
            "id": 1001,
            "role": "thumbnail",
            "size": 45678,
            "contentType": "image/jpeg"
          }
        ],
        "createdAt": "2026-03-28T10:01:00Z"
      }
    ]
  }
}
```

### Get Document

```http
GET /v1/documents/{id}
```

### Update Document

```http
PATCH /v1/documents/{id}
```

**Request:**
```json
{
  "name": "Renamed Document"
}
```

### Delete Document

```http
DELETE /v1/documents/{id}
```

### Get File Download URL

```http
GET /v1/documents/files/{fileId}/url
```

**Query Parameters:**
- `disposition` - `inline` or `attachment` (default: `inline`)

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://s3.amazonaws.com/frametap/...",
    "expiresAt": "2026-03-28T11:00:00Z"
  }
}
```

## Projects

### Create Project

```http
POST /v1/projects
```

**Request:**
```json
{
  "name": "E2E Tests",
  "description": "End-to-end test recordings"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 456,
    "name": "E2E Tests",
    "slug": "e2e-tests",
    "description": "End-to-end test recordings",
    "createdAt": "2026-03-28T10:00:00Z"
  }
}
```

### List Projects

```http
GET /v1/projects
```

**Query Parameters:**
- `id` - Filter by ID
- `name` - Filter by name (partial match)
- `slug` - Filter by slug
- `limit` - Items per page
- `cursor` - Pagination cursor

### Get Project

```http
GET /v1/projects/{id}
```

### Update Project

```http
PATCH /v1/projects/{id}
```

### Delete Project

```http
DELETE /v1/projects/{id}
```

## API Keys

### Create API Key

```http
POST /v1/keys
```

**Request:**
```json
{
  "name": "Production CI/CD",
  "scopes": ["jobs:create", "jobs:read", "documents:read"],
  "expiresAt": "2026-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 111,
    "name": "Production CI/CD",
    "prefix": "ft_api_",
    "key": "ft_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "scopes": ["jobs:create", "jobs:read", "documents:read"],
    "expiresAt": "2026-12-31T23:59:59Z",
    "createdAt": "2026-03-28T10:00:00Z"
  }
}
```

::: warning
The `key` is only returned once on creation. Store it securely.
:::

### List API Keys

```http
GET /v1/keys
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 111,
        "name": "Production CI/CD",
        "prefix": "ft_api_",
        "scopes": [...],
        "lastUsedAt": "2026-03-28T09:00:00Z",
        "expiresAt": "2026-12-31T23:59:59Z"
      }
    ]
  }
}
```

### Get API Key

```http
GET /v1/keys/{id}
```

### Delete API Key

```http
DELETE /v1/keys/{id}
```

## Billing

### Get Remaining Credits

```http
GET /v1/users/me/credits
```

**Response:**
```json
{
  "success": true,
  "data": {
    "credits": 284,
    "monthlyCredits": 300,
    "usedThisMonth": 16
  }
}
```

### List Products

```http
GET /v1/billing/products
```

### Buy Credits

```http
POST /v1/billing/credits
```

**Request:**
```json
{
  "productId": "credit-pack-small",
  "quantity": 1
}
```

## Authentication

### Login

Initiates WorkOS authentication flow.

```http
GET /v1/auth/login
```

Redirects to WorkOS, then to callback.

### Callback

```http
GET /v1/auth/callback?code=xxx
```

Exchanges WorkOS code for session.

### Logout

```http
GET /v1/auth/logout
```

Clears session cookie.

### Get Current User

```http
GET /v1/users/me
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 222,
    "email": "user@example.com",
    "name": "John Doe",
    "organizationId": 456
  }
}
```

## Health

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-03-28T10:00:00Z"
  }
}
```

## WebSocket Documentation

### Runner WebSocket

```http
GET /v1/ws/runners/how-to-use
```

Returns WebSocket protocol documentation for runners.

### Events WebSocket

```http
GET /v1/ws/events/how-to-use
```

Returns WebSocket protocol documentation for real-time events.

See [WebSocket Protocol](/api/websocket) for details.

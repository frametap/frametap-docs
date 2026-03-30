# Job Types

Frametap supports different job types for various capture and upload needs.

## Overview

```typescript
type JobType = 'recording' | 'screenshot' | 'stream' | 'file_upload'
```

## Recording Jobs

Capture video from a display.

### API Endpoint

```http
POST /v1/jobs
```

### Request Body

```json
{
  "runnerId": 123,
  "type": "recording",
  "displayId": ":0",
  "name": "My Recording",
  "stopCondition": "duration",
  "stopConditionConfig": {
    "durationSeconds": 60
  },
  "projectId": 456
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `runnerId` | integer | Yes | ID of runner to use |
| `type` | string | Yes | `"recording"` |
| `displayId` | string | Yes | Display to capture (e.g., `:0`, `:99`) |
| `name` | string | No | Human-readable name |
| `stopCondition` | string | Yes | `duration`, `interrupt`, or `selenium_idle` |
| `stopConditionConfig` | object | Yes | Configuration for stop condition |
| `projectId` | integer | No | Project to associate with |
| `recordAudio` | boolean | No | Whether to record audio (default: false) |

### CLI Usage

Auto-record mode:
```bash
export FRAMETAP_AUTO_RECORD=true
frametap up
```

## Screenshot Jobs

Capture a single frame from a display.

### API Endpoint

```http
POST /v1/jobs
```

### Request Body

```json
{
  "runnerId": 123,
  "type": "screenshot",
  "displayId": ":0",
  "name": "Login Page",
  "projectId": 456
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `runnerId` | integer | Yes | ID of runner to use |
| `type` | string | Yes | `"screenshot"` |
| `displayId` | string | Yes | Display to capture |
| `name` | string | No | Human-readable name |
| `projectId` | integer | No | Project to associate with |

### Scheduled Screenshots

For periodic captures:

```json
{
  "runnerId": 123,
  "type": "screenshot",
  "displayId": ":0",
  "name": "Periodic Capture",
  "scheduleIntervalS": 300,
  "scheduleEndAt": "2026-12-31T23:59:59Z"
}
```

## File Upload Jobs

Upload files from watch folder or trigger manual uploads.

### API Endpoint

```http
POST /v1/jobs
```

### Request Body

```json
{
  "runnerId": 123,
  "type": "file_upload",
  "name": "Artifact Upload",
  "includePatterns": ["*.png", "*.mp4", "*.log"],
  "excludePatterns": ["*.tmp"],
  "projectId": 456
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `runnerId` | integer | Yes | ID of runner to use |
| `type` | string | Yes | `"file_upload"` |
| `name` | string | No | Human-readable name |
| `includePatterns` | string[] | No | Glob patterns to include |
| `excludePatterns` | string[] | No | Glob patterns to exclude |
| `projectId` | integer | No | Project to associate with |

### CLI Usage

Setup watch folder:
```bash
frametap watch start --dir /app/output --exclude "*.tmp"
```

Or via environment:
```bash
export FRAMETAP_WATCH_DIR=/app/output
export FRAMETAP_WATCH_EXCLUDE="[*.tmp, *.log]"
frametap up
```

## Stream Jobs

Create a live stream from a display.

### API Endpoint

```http
POST /v1/jobs
```

### Request Body

```json
{
  "runnerId": 123,
  "type": "stream",
  "name": "Live View",
  "record": true,
  "projectId": 456
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `runnerId` | integer | Yes | ID of runner to use |
| `type` | string | Yes | `"stream"` |
| `name` | string | No | Human-readable name |
| `record` | boolean | No | Also record the stream |
| `projectId` | integer | No | Project to associate with |

## Job Status

Jobs progress through these statuses:

```typescript
type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
```

- **`queued`** - Waiting for runner assignment
- **`running`** - Actively executing
- **`completed`** - Successfully finished
- **`failed`** - Error occurred
- **`cancelled`** - Manually cancelled

### Check Status

```bash
curl https://api.frametap.io/v1/jobs/123 \
  -H "Authorization: Bearer $API_KEY"
```

## Job Events

Each job generates events for tracking progress:

### Recording Events

| Event | Description |
|-------|-------------|
| `job_started` | Job execution began |
| `recording_started` | Video capture began |
| `recording_uploading` | Video upload in progress |
| `recording_completed` | Video captured successfully |
| `recording_failed` | Capture or upload failed |
| `job_completed` | Job finished successfully |
| `job_failed` | Job failed |
| `job_cancelled` | Job was cancelled |

### Screenshot Events

| Event | Description |
|-------|-------------|
| `screenshot_capturing` | Screenshot in progress |
| `screenshot_captured` | Screenshot saved |
| `screenshot_failed` | Capture failed |

### File Upload Events

| Event | Description |
|-------|-------------|
| `file_uploading` | File upload started |
| `file_uploaded` | File uploaded successfully |
| `file_failed` | Upload failed |

### Get Events

```bash
curl https://api.frametap.io/v1/jobs/123/events \
  -H "Authorization: Bearer $API_KEY"
```

## Cancelling Jobs

### Cancel Running Job

```bash
curl -X POST https://api.frametap.io/v1/jobs/123/cancel \
  -H "Authorization: Bearer $API_KEY"
```

### Delete Job

```bash
curl -X DELETE https://api.frametap.io/v1/jobs/123 \
  -H "Authorization: Bearer $API_KEY"
```

## Listing Jobs

```bash
# List all jobs
curl https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY"

# Filter by status
curl "https://api.frametap.io/v1/jobs?status=running" \
  -H "Authorization: Bearer $API_KEY"

# Filter by type
curl "https://api.frametap.io/v1/jobs?jobType=recording" \
  -H "Authorization: Bearer $API_KEY"

# Filter by runner
curl "https://api.frametap.io/v1/jobs?runnerId=123" \
  -H "Authorization: Bearer $API_KEY"
```

## Examples

### Basic Recording

```bash
curl -X POST https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "runnerId": 123,
    "type": "recording",
    "displayId": ":0",
    "name": "Demo Recording",
    "stopCondition": "duration",
    "stopConditionConfig": {
      "durationSeconds": 120
    }
  }'
```

### Screenshot

```bash
curl -X POST https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "runnerId": 123,
    "type": "screenshot",
    "displayId": ":0",
    "name": "Homepage"
  }'
```

### Scheduled Screenshots

```bash
curl -X POST https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "runnerId": 123,
    "type": "screenshot",
    "displayId": ":0",
    "name": "Health Check",
    "scheduleIntervalS": 300,
    "scheduleEndAt": "2026-12-31T23:59:59Z"
  }'
```

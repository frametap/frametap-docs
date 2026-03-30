# Documents

Documents are the artifacts produced by Frametap jobs - recordings, screenshots, and uploaded files.

## Overview

When a job completes successfully, it creates a document containing:
- Metadata (dimensions, duration, file type)
- Files (primary media + variants like thumbnails)
- Upload status and download URLs

## Document Types

### Video

Screen recordings produce video documents.

```json
{
  "id": 999,
  "type": "video",
  "status": "ready",
  "name": "Test Recording",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "duration": 60,
    "codec": "h264",
    "hasAudio": false
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
  ]
}
```

### Screenshot

Screenshot jobs produce image documents.

```json
{
  "id": 1000,
  "type": "screenshot",
  "status": "ready",
  "name": "Homepage",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "format": "png"
  }
}
```

### File Upload

Watch folder uploads produce document records.

```json
{
  "id": 1001,
  "type": "file",
  "status": "ready",
  "name": "report.pdf",
  "metadata": {
    "size": 1048576,
    "mimeType": "application/pdf",
    "checksum": "abc123..."
  }
}
```

## Document Status

- **`pending`** - Upload in progress
- **`ready`** - Upload complete, available for download
- **`failed`** - Upload failed
- **`deleted`** - Marked for deletion

## File Roles

Each document can have multiple files:

- **`primary`** - Main artifact (video, image, document)
- **`thumbnail`** - Preview thumbnail (auto-generated for videos)
- **`preview`** - Lower-resolution preview
- **`optimized`** - Optimized version (compressed)
- **`timeline`** - Timeline metadata (for videos)
- **`log`** - Log files from capture
- **`segment`** - Video segments (for streaming)

## Downloading Documents

### Get Download URL

```bash
# Get URL for a specific file
curl "https://api.frametap.io/v1/documents/files/1000/url?disposition=attachment" \
  -H "Authorization: Bearer $API_KEY"
```

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

### Download with cURL

```bash
# Get URL and download
URL=$(curl -s "https://api.frametap.io/v1/documents/files/1000/url" \
  -H "Authorization: Bearer $API_KEY" \
  | jq -r '.data.url')

curl -o recording.mp4 "$URL"
```

### Download via Dashboard

1. Go to [frametap.io/recordings](https://frametap.io/recordings)
2. Find your recording
3. Click download button

## Managing Documents

### List Documents

```bash
# All documents
curl https://api.frametap.io/v1/documents \
  -H "Authorization: Bearer $API_KEY"

# Filter by type
curl "https://api.frametap.io/v1/documents?type=video" \
  -H "Authorization: Bearer $API_KEY"

# Filter by project
curl "https://api.frametap.io/v1/documents?projectId=456" \
  -H "Authorization: Bearer $API_KEY"

# Filter by job
curl "https://api.frametap.io/v1/documents?jobId=789" \
  -H "Authorization: Bearer $API_KEY"
```

### Update Document

```bash
curl -X PATCH https://api.frametap.io/v1/documents/999 \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"name": "Renamed Recording"}'
```

### Delete Document

```bash
curl -X DELETE https://api.frametap.io/v1/documents/999 \
  -H "Authorization: Bearer $API_KEY"
```

## Document Events

Track document lifecycle:

```bash
curl https://api.frametap.io/v1/documents/999/events \
  -H "Authorization: Bearer $API_KEY"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "eventType": "document_created",
        "createdAt": "2026-03-28T10:01:00Z"
      },
      {
        "id": 2,
        "eventType": "file_uploading",
        "payload": { "fileId": 1000, "role": "primary" },
        "createdAt": "2026-03-28T10:01:05Z"
      },
      {
        "id": 3,
        "eventType": "file_uploaded",
        "payload": { "fileId": 1000, "size": 12345678 },
        "createdAt": "2026-03-28T10:01:10Z"
      },
      {
        "id": 4,
        "eventType": "document_ready",
        "createdAt": "2026-03-28T10:01:10Z"
      }
    ]
  }
}
```

## Storage Retention

Documents are stored based on your plan:

| Plan | Retention |
|------|-----------|
| Free | 7 days |
| Dev | 30 days |
| Pro | 60 days |

After the retention period, documents are automatically deleted.

## File Size Limits

| Plan | Max File Size |
|------|---------------|
| Free | 100 MB |
| Dev | 5 GB |
| Pro | 15 GB |

## Best Practices

### 1. Name Documents Meaningfully

```bash
curl -X POST /v1/jobs \
  -d '{
    "type": "recording",
    "name": "Checkout Flow - Success Case"
  }'
```

### 2. Organize by Project

```bash
# Create project for team
curl -X POST /v1/projects -d '{"name": "QA Team"}'

# Assign all QA recordings to this project
curl -X POST /v1/jobs \
  -d '{"type": "recording", "projectId": 456, ...}'
```

### 3. Download Before Retention Expires

Set up alerts or automation:

```python
# Check document age and download if needed
import datetime

def check_and_backup(document_id):
    doc = get_document(document_id)
    created = datetime.fromisoformat(doc['createdAt'])
    age = datetime.now() - created
    
    if age.days > 25:  # Within 5 days of 30-day limit
        url = get_download_url(doc['files'][0]['id'])
        download_to_backup(url, doc['name'])
```

### 4. Use Thumbnails for Quick Preview

Video documents include auto-generated thumbnails:

```bash
# Get thumbnail URL
curl "https://api.frametap.io/v1/documents/999" \
  -H "Authorization: Bearer $API_KEY" \
  | jq '.data.files[] | select(.role == "thumbnail") | .id'
```

## Troubleshooting

### Document stuck in "pending"
- Check runner is still connected
- Verify upload completed (check job events)
- May need to retry the job

### Cannot download
- Check document status is "ready"
- Verify URL hasn't expired (regenerate if needed)
- Check file still exists (not deleted)

### Missing thumbnail
- Thumbnails are generated asynchronously
- Wait 1-2 minutes after video upload
- Check document events for thumbnail status

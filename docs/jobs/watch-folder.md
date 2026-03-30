# Watch Folder Uploads

Watch folder monitoring automatically detects and uploads files from a directory.

## Overview

The Frametap runner can monitor a directory for new files and automatically:
- Detect file creation and modification
- Compute SHA256 checksums
- Deduplicate (skip files already uploaded)
- Extract metadata (dimensions, codec, duration)
- Upload to Frametap dashboard

## Setup

### CLI Setup

```bash
# Start watching a directory
frametap watch start --dir /app/output --exclude "*.tmp" --exclude "*.log"
```

### Environment Setup

```bash
export FRAMETAP_WATCH_DIR=/app/output
export FRAMETAP_WATCH_EXCLUDE="[*.tmp, *.log, node_modules/**]"
frametap up
```

### Docker Compose

```yaml
services:
  frametap:
    image: frametap/frametap-cli:latest
    environment:
      - FRAMETAP_TOKEN=${FRAMETAP_TOKEN}
      - FRAMETAP_WATCH_DIR=/app/output
      - FRAMETAP_WATCH_EXCLUDE=[*.tmp, *.log]
    volumes:
      - ./output:/app/output:ro
      - frametap-data:/home/frametap/.config/frametap
```

## Path Requirements

Watch folders must meet these requirements:

- **Absolute path**: Must be full path (e.g., `/home/user/files`)
- **No symlinks**: Directory must not be a symlink or contain symlinks in path
- **No path traversal**: Cannot use `..` in path
- **Readable**: User must have read permissions

## Exclude Patterns

Use glob patterns to skip unwanted files:

```bash
# Multiple patterns
frametap watch start \
  --dir /app/output \
  --exclude "*.tmp" \
  --exclude "*.log" \
  --exclude "node_modules/**"
```

### Common Patterns

| Pattern | Description |
|---------|-------------|
| `*.tmp` | Temporary files |
| `*.log` | Log files |
| `.*` | Hidden files |
| `node_modules/**` | Dependencies |
| `*.cache` | Cache files |
| `**/build/**` | Build outputs (if not wanted) |

### Environment Variable Format

```bash
export FRAMETAP_WATCH_EXCLUDE="[*.tmp, *.log, .DS_Store]"
```

JSON array format with glob patterns.

## How It Works

```mermaid
sequenceDiagram
    participant FS as File System
    participant W as Watcher
    participant CD as Checksum DB
    participant API as Backend API
    
    loop File Events
        FS->>W: Create/Write event
        W->>W: 2s debounce
        W->>W: Apply exclude patterns
        W->>W: Compute SHA256
        W->>CD: Check duplicate
        alt Not duplicate
            W->>W: Extract metadata
            W->>API: file_appeared event
            API->>W: Upload instructions
            W->>API: Upload file
            API->>CD: Store checksum
        end
    end
```

### Event Debouncing

- Files must be stable for 2 seconds before processing
- Prevents uploading incomplete files
- Multiple rapid changes are collapsed into one event

### Checksum Deduplication

- SHA256 computed for each file
- Checksums stored in `checksums.json`
- Persists across daemon restarts
- Files with same checksum are skipped

## File Types

The runner automatically detects file types:

| Type | Extensions | Metadata Extracted |
|------|------------|-------------------|
| **Image** | .png, .jpg, .jpeg, .gif, .webp | Width, height, format |
| **Video** | .mp4, .mov, .avi, .webm | Width, height, codec, duration, hasAudio |
| **Document** | .pdf, .doc, .docx, .txt, .md | MIME type, size |
| **Other** | Any | Size only |

## Status Commands

### Check Watch Status

```bash
frametap watch status
```

Output:
```
Watching:    true
Directory:   /app/output
Exclusions:  *.tmp, *.log
Files today: 12
Uploads:     10 (2 duplicates skipped)
```

### Stop Watching

```bash
frametap watch stop
```

## Startup Behavior

When the watcher starts:

1. Scans all existing files in the directory
2. Processes each file (dedup, metadata, upload)
3. Then starts monitoring for new events
4. Backend deduplication prevents duplicates even on fresh starts

## WebSocket Events

The runner sends events to the backend:

```json
{
  "feature": "watch",
  "message": "file_appeared",
  "payload": {
    "path": "/app/output/screenshot.png",
    "checksum": "abc123...",
    "size": 1024567,
    "fileType": "image",
    "contentType": "image/png",
    "metadata": {
      "width": 1920,
      "height": 1080
    },
    "detectedAt": "2026-03-28T10:30:00Z"
  }
}
```

## Examples

### CI/CD Artifacts

Upload test artifacts automatically:

```yaml
services:
  app:
    build: .
    volumes:
      - ./output:/app/output
  
  frametap:
    image: frametap/frametap-cli:latest
    environment:
      - FRAMETAP_TOKEN=${FRAMETAP_TOKEN}
      - FRAMETAP_WATCH_DIR=/app/output
      - FRAMETAP_WATCH_EXCLUDE=[*.log, *.tmp]
    volumes:
      - ./output:/app/output:ro
      - frametap-data:/home/frametap/.config/frametap
```

### Screenshots from Tests

```python
# test_with_screenshots.py
from selenium import webdriver
import os

OUTPUT_DIR = os.environ.get('FRAMETAP_WATCH_DIR', '/app/output')

def save_screenshot(driver, name):
    path = f"{OUTPUT_DIR}/{name}.png"
    driver.save_screenshot(path)
    print(f"Screenshot saved: {path}")
    # Frametap will auto-upload!

driver = webdriver.Chrome()
driver.get("https://example.com")
save_screenshot(driver, "homepage")
driver.quit()
```

### Log File Rotation

```bash
# Exclude logs but watch everything else
frametap watch start \
  --dir /app/data \
  --exclude "*.log" \
  --exclude "*.log.*" \
  --exclude "*.tmp"
```

### Multiple Watchers

Run multiple runners for different directories:

```yaml
services:
  frametap-screenshots:
    image: frametap/frametap-cli:latest
    environment:
      - FRAMETAP_TOKEN=${FRAMETAP_TOKEN}
      - FRAMETAP_HOSTNAME=screenshot-runner
      - FRAMETAP_WATCH_DIR=/app/screenshots
    volumes:
      - ./screenshots:/app/screenshots:ro
      - frametap-data-ss:/home/frametap/.config/frametap

  frametap-logs:
    image: frametap/frametap-cli:latest
    environment:
      - FRAMETAP_TOKEN=${FRAMETAP_TOKEN}
      - FRAMETAP_HOSTNAME=log-runner
      - FRAMETAP_WATCH_DIR=/app/logs
    volumes:
      - ./logs:/app/logs:ro
      - frametap-data-logs:/home/frametap/.config/frametap
```

## Troubleshooting

### Files not uploading

**Check:**
```bash
# Is watching enabled?
frametap watch status

# Is path absolute?
echo $FRAMETAP_WATCH_DIR  # Should start with /

# Check logs
docker compose logs frametap
```

### Duplicate uploads

Check checksum database:
```bash
cat ~/.local/share/frametap/checksums.json
```

Clear if needed:
```bash
rm ~/.local/share/frametap/checksums.json
```

### Permission denied

```bash
# Check path exists and is readable
ls -la $FRAMETAP_WATCH_DIR

# Fix permissions
chmod 755 /app/output
```

### Symlink errors

The watch path cannot contain symlinks:

```bash
# Check for symlinks
ls -la /app/output

# Use real path
readlink -f /app/output
```

### High CPU usage

- Too many small files being created rapidly
- Add more exclude patterns
- Increase debounce (not configurable, fixed at 2s)

## Best Practices

### 1. Use Read-Only Mounts

```yaml
volumes:
  - ./output:/app/output:ro
```

Runner only needs read access.

### 2. Exclude Temp Files

Always exclude temporary/working files:

```bash
--exclude "*.tmp" --exclude "*.part" --exclude "*.crdownload"
```

### 3. Persist Data Directory

Mount the data directory to preserve checksums:

```yaml
volumes:
  - frametap-data:/home/frametap/.config/frametap
```

### 4. Organize by Type

Use subdirectories and multiple runners:

```
/app/
  /screenshots  → screenshot-runner
  /videos       → video-runner
  /logs         → log-runner
```

### 5. Clean Up Regularly

Remove old files to prevent storage bloat:

```bash
# Cron job to clean old files
find /app/output -type f -mtime +7 -delete
```

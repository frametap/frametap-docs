# Docker Setup

Use `frametap/frametap` when you want to run the Frametap runner inside Docker.

Docker image:

- [frametap/frametap on Docker Hub](https://hub.docker.com/r/frametap/frametap)

The image is best suited for:

- Selenium and browser automation containers
- CI jobs that need recordings or screenshots
- sandboxed or ephemeral environments
- watch-folder uploads from generated artifacts

The most common Docker setup is a sidecar next to Selenium, where Frametap connects to the Selenium display, records the browser session, and uploads the result.

## Basic Docker Run

```bash
docker run -d \
  --name frametap \
  -e FRAMETAP_TOKEN=ft_enrollment_xxxxxxxxxxxxxxxxx \
  -e FRAMETAP_AUTO_RECORD=true \
  frametap/frametap:latest
```

## Docker Compose

### Simple Setup

```yaml
version: '3.8'
services:
  frametap:
    image: frametap/frametap:latest
    env_file:
      - .env
    environment:
      - FRAMETAP_TOKEN=${FRAMETAP_TOKEN}
      - FRAMETAP_AUTO_RECORD=${FRAMETAP_AUTO_RECORD:-false}
      - FRAMETAP_JOB_NAME=${FRAMETAP_JOB_NAME:-Docker Recording}
    volumes:
      - frametap-data:/home/frametap/.config/frametap

volumes:
  frametap-data:
```

### With Selenium (Full Stack)

This is the recommended example if you want to understand how the image is typically used in practice.

```yaml
version: '3.8'
services:
  selenium:
    image: selenium/standalone-chrome:latest
    platform: linux/amd64
    shm_size: 2gb
    environment:
      - SE_NODE_MAX_SESSIONS=1
      - DISPLAY=:99
      - SE_SCREEN_WIDTH=1280
      - SE_SCREEN_HEIGHT=720
    ports:
      - "4444:4444"
      - "6099:6099"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4444/wd/hub/status"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s

  frametap:
    image: frametap/frametap:latest
    env_file:
      - .env
    environment:
      - FRAMETAP_TOKEN=${FRAMETAP_TOKEN}
      - FRAMETAP_AUTO_RECORD=true
      - 'FRAMETAP_JOB_NAME=${FRAMETAP_JOB_NAME:-selenium CI: Email Validation Failure Recording}'
      - FRAMETAP_HOSTNAME=${FRAMETAP_HOSTNAME:-selenium CI}
      - SE_GRID_URL=http://selenium:4444
      - DISPLAY=selenium:99
    depends_on:
      - selenium
    volumes:
      - frametap-data:/home/frametap/.config/frametap

  selenium-test:
    build:
      context: .
      dockerfile: Dockerfile.selenium
    environment:
      - SELENIUM_REMOTE_URL=http://selenium:4444/wd/hub
      - SELENIUM_DEMO_RUNNER_NAME=${FRAMETAP_HOSTNAME:-selenium CI}
    depends_on:
      selenium:
        condition: service_healthy
      frametap:
        condition: service_started
    volumes:
      - ./:/tests
    command: ["python", "selenium_test.py"]

volumes:
  frametap-data:
```

Environment file (`.env`):
```
FRAMETAP_TOKEN=ft_enrollment_xxxxxxxxxxxxxxxxx
FRAMETAP_AUTO_RECORD=true
FRAMETAP_JOB_NAME=selenium CI: Email Validation Failure Recording
FRAMETAP_HOSTNAME=selenium CI
```

How this works:

1. `selenium` provides the browser and X11 display
2. `frametap` connects to that display with `DISPLAY=selenium:99`
3. `FRAMETAP_AUTO_RECORD=true` starts recording automatically
4. `SE_GRID_URL=http://selenium:4444` lets Frametap stop based on Selenium activity
5. the named volume preserves runner state across container restarts

If you are running Docker on Apple Silicon but using the Selenium standalone Chrome image, `platform: linux/amd64` helps keep the environment consistent.

For a more complete walkthrough, see [Selenium Integration](/installation/selenium).

## Key Environment Variables

### Required
- `FRAMETAP_TOKEN` - Enrollment token

### Optional
- `FRAMETAP_AUTO_RECORD` - Start recording immediately (`true`/`false`)
- `FRAMETAP_JOB_NAME` - Name for auto-recorded jobs
- `DISPLAY` - X11 display to capture (e.g., `:99`, `selenium:99`)
- `FRAMETAP_HOSTNAME` - Custom runner name
- `FRAMETAP_WATCH_DIR` - Directory to watch for file uploads
- `FRAMETAP_FFMPEG_PATH` - Path to ffmpeg binary

### Selenium Integration
- `SE_GRID_URL` - Selenium Grid URL
- `SE_GRID_USERNAME` - Basic auth username (if required)
- `SE_GRID_PASSWORD` - Basic auth password (if required)

## X11 Display Configuration

When capturing from another container (like Selenium), you need to share the X11 display:

```yaml
services:
  selenium:
    environment:
      - DISPLAY=:99
    # ...
  
  frametap:
    environment:
      - DISPLAY=selenium:99  # Connect to selenium's display
    # ...
```

The Selenium image exposes X11 on port 6099 (or you can use hostname resolution).

## Persistent Data

Mount a volume for runner data persistence:

```yaml
volumes:
  - frametap-data:/home/frametap/.config/frametap
```

This preserves:
- Runner registration
- Watch folder configuration
- Checksum database (prevents duplicate uploads)

## Watch Folder in Docker

To auto-upload files from a container directory:

```yaml
services:
  frametap:
    image: frametap/frametap:latest
    env_file:
      - .env
    environment:
      - FRAMETAP_TOKEN=${FRAMETAP_TOKEN}
      - FRAMETAP_WATCH_DIR=/app/output
    volumes:
      - ./output:/app/output:ro
      - frametap-data:/home/frametap/.config/frametap
```

Requirements:
- Path must be absolute
- Mount as read-only (`:ro`) if the runner shouldn't modify files
- Directory must not contain symlinks

## Troubleshooting

### "Cannot open display"
- Ensure DISPLAY is set correctly
- For multi-container setups, use service name: `DISPLAY=selenium:99`
- Check X11 forwarding is enabled

### "No screens found"
- The target display must have an X11 server running
- Selenium images include Xvfb for headless display
- For real displays, you may need `xhost +local:docker`

### Files not uploading
- Check watch path is absolute
- Verify volume mounts are correct
- Check checksum deduplication (files already uploaded won't re-upload)
- Check whether the file exceeds the upload limit for your plan; if so, Frametap shows a notification in the app when the upload is triggered

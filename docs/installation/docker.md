# Docker Setup

Frametap can run inside Docker containers to capture screens from within isolated environments.

## Basic Docker Run

```bash
docker run -d \
  --name frametap \
  -e FRAMETAP_TOKEN=ft_enrollment_xxxxxxxxxxxxxxxxx \
  -e FRAMETAP_AUTO_RECORD=true \
  frametap/frametap-cli:latest
```

## Docker Compose

### Simple Setup

```yaml
version: '3.8'
services:
  frametap:
    image: frametap/frametap-cli:latest
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

```yaml
version: '3.8'
services:
  selenium:
    image: selenium/standalone-chrome:latest
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

  frametap:
    image: frametap/frametap-cli:latest
    environment:
      - FRAMETAP_TOKEN=${FRAMETAP_TOKEN}
      - FRAMETAP_AUTO_RECORD=true
      - FRAMETAP_JOB_NAME=Selenium Docker Test
      - SE_GRID_URL=http://selenium:4444
      - DISPLAY=selenium:99
    depends_on:
      - selenium
    volumes:
      - frametap-data:/home/frametap/.config/frametap

  test:
    build:
      context: .
      dockerfile: Dockerfile.test
    environment:
      - SELENIUM_REMOTE_URL=http://selenium:4444/wd/hub
    depends_on:
      selenium:
        condition: service_healthy
    volumes:
      - ./tests:/tests
    command: ["python", "test.py"]

volumes:
  frametap-data:
```

Environment file (`.env`):
```
FRAMETAP_TOKEN=ft_enrollment_xxxxxxxxxxxxxxxxx
FRAMETAP_AUTO_RECORD=true
FRAMETAP_JOB_NAME=Selenium Docker Test
```

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
    image: frametap/frametap-cli:latest
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

## Building Custom Image

```dockerfile
FROM frametap/frametap-cli:latest

# Add custom tools
RUN apt-get update && apt-get install -y \
    curl \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Copy custom scripts
COPY scripts/ /usr/local/bin/

# Set custom environment
ENV FRAMETAP_JOB_NAME="Custom Docker Runner"

ENTRYPOINT ["frametapd"]
```

Build and run:
```bash
docker build -t my-frametap .
docker run -e FRAMETAP_TOKEN=<token> my-frametap
```

## Health Checks

Add health checks to your compose:

```yaml
services:
  frametap:
    image: frametap/frametap-cli:latest
    healthcheck:
      test: ["CMD", "frametap", "status"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
```

## Kubernetes

Example sidecar configuration:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers:
    - name: app
      image: my-app:latest
      env:
        - name: DISPLAY
          value: ":99"
    
    - name: frametap
      image: frametap/frametap-cli:latest
      env:
        - name: FRAMETAP_TOKEN
          valueFrom:
            secretKeyRef:
              name: frametap-token
              key: token
        - name: FRAMETAP_AUTO_RECORD
          value: "true"
        - name: DISPLAY
          value: ":99"
      volumeMounts:
        - name: frametap-data
          mountPath: /home/frametap/.config/frametap
  
  volumes:
    - name: frametap-data
      emptyDir: {}
```

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

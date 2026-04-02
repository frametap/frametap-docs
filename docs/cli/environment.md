# Environment Variables

Frametap CLI behavior can be configured via environment variables.

## Required Variables

### `FRAMETAP_TOKEN`

Enrollment token for runner registration.

```bash
export FRAMETAP_TOKEN=ft_enrollment_xxxxxxxxxxxxxxxxx
```

**Used by:** `frametap up`

**Format:** `ft_enrollment_<22 chars>`

## Capture Configuration

### `DISPLAY`

X11 display to capture from.

```bash
export DISPLAY=:0          # Local display
export DISPLAY=selenium:99   # Remote display (Docker)
```

**Default:** None (auto-detect or use :0)

**Used by:** Recording, screenshot jobs

### `FRAMETAP_FFMPEG_PATH`

Path to ffmpeg binary.

```bash
export FRAMETAP_FFMPEG_PATH=/usr/local/bin/ffmpeg
```

**Default:** System PATH

**Note:** ffprobe must be next to ffmpeg or on PATH

### `FRAMETAP_HOSTNAME`

Custom runner name.

```bash
export FRAMETAP_HOSTNAME="ci-runner-prod-1"
```

**Default:** OS hostname

**Used by:** Runner registration

## Auto-Record Configuration

### `FRAMETAP_AUTO_RECORD`

Automatically start recording when runner starts.

```bash
export FRAMETAP_AUTO_RECORD=true
```

**Values:** `true`, `false`

**Default:** `false`

### `FRAMETAP_JOB_NAME`

Name for auto-recorded jobs.

```bash
export FRAMETAP_JOB_NAME="CI E2E Test Run"
```

**Default:** "Auto Recording"

**Used by:** Auto-record mode

## Selenium Integration

### `SE_GRID_URL`

Selenium Grid URL for idle detection.

```bash
export SE_GRID_URL=http://localhost:4444
export SE_GRID_URL=http://selenium:4444  # Docker
```

**Default:** None

**Used by:** `selenium_idle` stop condition, auto-record

### `SE_GRID_USERNAME`

Basic auth username for Selenium Grid.

```bash
export SE_GRID_USERNAME=myuser
```

**Default:** None

### `SE_GRID_PASSWORD`

Basic auth password for Selenium Grid.

```bash
export SE_GRID_PASSWORD=mypass
```

**Default:** None

## Watch Folder Configuration

### `FRAMETAP_WATCH_DIR`

Directory to watch for file uploads.

```bash
export FRAMETAP_WATCH_DIR=/app/output
```

**Requirements:**
- Must be absolute path
- No symlinks
- User must have read permissions

**Used by:** Watch folder uploads

### `FRAMETAP_WATCH_EXCLUDE`

Glob patterns to exclude from watching.

```bash
export FRAMETAP_WATCH_EXCLUDE="[*.log, *.tmp, node_modules/**]"
```

**Format:** comma-separated or bracketed glob list

**Default:** None

## Daemon Configuration

### `FRAMETAP_DAEMON_DATA_DIR`

Data directory for daemon state.

```bash
export FRAMETAP_DAEMON_DATA_DIR=/var/lib/frametap
```

**Default:** 
- Linux: `~/.config/frametap`
- macOS: `~/Library/Application Support/frametap`

**Contains:**
- `runner.json` - Runner registration
- `daemon.sock` - Local CLI socket
- `frametapd.log` - Daemon log output
- `watch-checksums.json` - Watch-folder deduplication database

### `FRAMETAP_DAEMON_SOCKET_PATH`

UNIX socket path for CLI-daemon communication.

```bash
export FRAMETAP_DAEMON_SOCKET_PATH=/run/frametap.sock
```

**Default:** 
- Linux and macOS: `{FRAMETAP_DAEMON_DATA_DIR}/daemon.sock`

## Complete Docker Example

```yaml
services:
  frametap:
    image: frametap/frametap:latest
    environment:
      # Required
      - FRAMETAP_TOKEN=ft_enrollment_xxxxxxxxxxxxxxxxx
      
      # Auto-record
      - FRAMETAP_AUTO_RECORD=true
      - FRAMETAP_JOB_NAME=Selenium CI Test
      
      # Selenium integration
      - SE_GRID_URL=http://selenium:4444
      - SE_GRID_USERNAME=${SE_USER}
      - SE_GRID_PASSWORD=${SE_PASS}
      
      # Display capture
      - DISPLAY=selenium:99
      
      # Watch folder
      - FRAMETAP_WATCH_DIR=/app/artifacts
      - FRAMETAP_WATCH_EXCLUDE=[*.log, *.tmp]
      
      # Optional overrides
      - FRAMETAP_HOSTNAME=ci-runner-1
      - FRAMETAP_FFMPEG_PATH=/usr/bin/ffmpeg
```

## Environment File (.env)

Create a `.env` file for local development:

```bash
# Frametap
FRAMETAP_TOKEN=ft_enrollment_xxxxxxxxxxxxxxxxx
FRAMETAP_HOSTNAME=dev-machine
FRAMETAP_AUTO_RECORD=false

# Selenium (for testing)
SE_GRID_URL=http://localhost:4444

# Display
DISPLAY=:0
```

Load it:
```bash
# Option 1: Source it
source .env

# Option 2: Use with Docker
docker run --env-file .env frametap/frametap:latest

# Option 3: Use with docker-compose
docker compose --env-file .env up
```

## Platform-Specific Notes

### Linux
- `DISPLAY` must be set for X11 capture
- `wmctrl` required for window listing
- Socket path uses `$XDG_RUNTIME_DIR` if available

### macOS
- Display capture uses macOS native APIs
- Window listing not yet supported
- Data stored in `~/Library/Application Support/`

### Windows
- WSL2 recommended for full functionality
- Native Windows support coming soon

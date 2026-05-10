# Quick Start

Get up and running with Frametap in under 5 minutes.

## Prerequisites

- A Frametap account (sign up at [frametap.io](https://frametap.io))
- A runner enrollment key from the app

## Step 1: Install the CLI

```bash
curl -fsSL https://cli.static.frametap.io/install | bash
```

This installs the Frametap runner binaries so the machine can connect to Frametap and execute jobs.

## Step 2: Enroll Your Runner

Get your enrollment token from [Settings → API Keys](https://frametap.io/app/settings/), then run:

```bash
frametap up --token ft_enrollment_xxxxxxxxxxxxxxxxx
```

This registers your machine as a runner and starts the daemon.

Verify it's working:

```bash
frametap status
```

You should see version, uptime, and runner information. The runner should also appear in [Runners](https://frametap.io/app/runners).

## Step 3: Trigger Your First Recording

### Option A: Via Dashboard (Easiest)

The easiest way to trigger your first recording is directly from the app:

1. Go to [frametap.io/app](https://frametap.io/app)
2. Confirm your runner is ready in [Runners](https://frametap.io/app/runners)
3. Navigate to [Jobs](https://frametap.io/app/jobs)
4. Click "Create Job"
5. Select the runner, display, and job type
6. Choose one-time or recurring execution
7. For recordings, choose the stop condition
8. Click "Start"

Your runner will immediately start recording and upload the result.

### Option B: Via CLI

If you are already on the runner machine, start a recording directly from the CLI:

```bash
# Optional: inspect display IDs first
frametap displays

# Record the default display for 30 seconds
frametap recording start --duration 30 --name "First Recording"
```

For an interrupt recording that you stop manually, omit `--duration`:

```bash
frametap recording start --name "Manual Recording"
frametap recording stop
```

You can also capture a screenshot directly from the runner:

```bash
frametap screenshot --name "First Screenshot"
```

### Option C: Via API

::: info Prerequisites for API Control
Before using the API, create an access key:

1. Go to your [Frametap app Settings page](https://frametap.io/app/settings/)
2. Navigate to **API Keys**
3. Switch to **Access Keys**
4. Click **"Create API Key"**
5. Copy your API key (starts with `ft_api_...`)
6. Set it as an environment variable: `export FRAMETAP_API_KEY=ft_api_xxxxxxxx`
:::

```bash
# Set your API key
export FRAMETAP_API_KEY=ft_api_xxxxxxxxxxxxxxxxx
export FRAMETAP_ORG_ID=123

# Get your runner ID from the dashboard or CLI
RUNNER_ID=123

# Create a recording job via API
curl -X POST "https://api.frametap.io/v1/jobs?organizationId=$FRAMETAP_ORG_ID" \
  -H "Authorization: Bearer $FRAMETAP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "recording",
    "runnerId": '"$RUNNER_ID"',
    "displayId": "0",
    "stopCondition": "duration",
    "stopConditionConfig": {
      "durationSeconds": 30
    }
  }'
```

### Option D: Auto-Record Mode

Set the `FRAMETAP_AUTO_RECORD` environment variable:

```bash
export FRAMETAP_TOKEN=ft_enrollment_xxxxxxxxxxxxxxxxx
export FRAMETAP_AUTO_RECORD=true
export FRAMETAP_JOB_NAME="My Test Recording"

frametap up
```

The runner will automatically start recording when it starts up.

### Option E: Selenium in Docker

If you run browser automation in containers, use the Docker image with Selenium.

- Docker image: [frametap/frametap on Docker Hub](https://hub.docker.com/r/frametap/frametap)
- Full guide: [Selenium Integration](/installation/selenium)

```yaml
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
      - 'FRAMETAP_JOB_NAME=${FRAMETAP_JOB_NAME:-Selenium CI Smoke}'
      - FRAMETAP_HOSTNAME=${FRAMETAP_HOSTNAME:-selenium CI}
      - SE_GRID_URL=http://selenium:4444
      - DISPLAY=selenium:99
    depends_on:
      - selenium
    volumes:
      - frametap-data:/home/frametap/.config/frametap

volumes:
  frametap-data:
```

Example `.env`:

```bash
FRAMETAP_TOKEN=ft_enrollment_xxxxxxxxxxxxxxxxx
FRAMETAP_AUTO_RECORD=true
FRAMETAP_JOB_NAME=Selenium CI Smoke
FRAMETAP_HOSTNAME=selenium CI
```

This records the browser session running inside Selenium and uploads the result back to Frametap.

## Step 4: View the Result

1. Go to [frametap.io/app](https://frametap.io/app)
2. Navigate to [Recordings](https://frametap.io/app/recordings)
3. You'll see your recording with timeline view

## Next Steps

- [Learn about job types](/jobs/types)
- [Set up watch folder uploads](/jobs/watch-folder)
- [Use the Docker image](https://hub.docker.com/r/frametap/frametap)
- [Integrate with Selenium](/installation/selenium)
- [Use the app](/overview/app)
- [Explore CLI commands](/cli/commands)
- [Open the interactive API reference](https://api-reference.frametap.io/)

# Stop Conditions

Stop conditions define when a recording job should end.

## Overview

```typescript
type StopCondition = 'duration' | 'interrupt' | 'selenium_idle'
```

## Duration

Record for a fixed amount of time.

### Configuration

```json
{
  "stopCondition": "duration",
  "stopConditionConfig": {
    "durationSeconds": 60
  }
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `durationSeconds` | integer | Yes | Recording length in seconds (min: 1) |

### Example

```bash
curl -X POST https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "runnerId": 123,
    "type": "recording",
    "displayId": ":0",
    "name": "2 Minute Recording",
    "stopCondition": "duration",
    "stopConditionConfig": {
      "durationSeconds": 120
    }
  }'
```

### Use Cases

- Fixed-length demos
- Scheduled captures
- Time-boxed debugging
- Creating consistent-length clips

## Interrupt

Wait for manual cancellation.

### Configuration

```json
{
  "stopCondition": "interrupt",
  "stopConditionConfig": {}
}
```

### Starting the Job

```bash
curl -X POST https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "runnerId": 123,
    "type": "recording",
    "displayId": ":0",
    "name": "Manual Recording",
    "stopCondition": "interrupt"
  }'
```

### Stopping the Job

```bash
curl -X POST https://api.frametap.io/v1/jobs/123/cancel \
  -H "Authorization: Bearer $API_KEY"
```

### Use Cases

- Interactive debugging sessions
- Ad-hoc captures
- When duration is unknown
- Multi-stage recordings

### Example: Multi-Stage Recording

```python
import requests
import time

API_KEY = 'ft_api_...'
RUNNER_ID = 123

def record_phase(name, duration):
    """Record a specific phase of a test."""
    job = requests.post(
        'https://api.frametap.io/v1/jobs',
        headers={'Authorization': f'Bearer {API_KEY}'},
        json={
            'runnerId': RUNNER_ID,
            'type': 'recording',
            'displayId': ':0',
            'name': name,
            'stopCondition': 'interrupt'
        }
    ).json()
    
    # Run the phase
    time.sleep(duration)
    
    # Stop recording
    requests.post(
        f'https://api.frametap.io/v1/jobs/{job["id"]}/cancel',
        headers={'Authorization': f'Bearer {API_KEY}'}
    )
    
    return job['id']

# Run different test phases
record_phase('Phase 1: Login', 30)
record_phase('Phase 2: Browse', 45)
record_phase('Phase 3: Checkout', 60)
```

## Selenium Idle

Stop when Selenium Grid detects no active sessions.

### Configuration

```json
{
  "stopCondition": "selenium_idle",
  "stopConditionConfig": {
    "gridUrl": "http://selenium:4444",
    "gridUsername": "optional",
    "gridPassword": "optional"
  }
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `gridUrl` | string | Yes | Selenium Grid URL |
| `gridUsername` | string | No | Basic auth username |
| `gridPassword` | string | No | Basic auth password |

### Example

```bash
curl -X POST https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "runnerId": 123,
    "type": "recording",
    "displayId": ":0",
    "name": "Selenium Test Recording",
    "stopCondition": "selenium_idle",
    "stopConditionConfig": {
      "gridUrl": "http://selenium:4444",
      "gridUsername": "admin",
      "gridPassword": "secret"
    }
  }'
```

### How It Works

1. Runner starts recording
2. Polls Selenium Grid status endpoint: `http://selenium:4444/wd/hub/status`
3. Monitors active session count
4. When count drops to 0 and stays there for 5 seconds, stops recording
5. Uploads video to dashboard

### Auto-Record Mode

With auto-record, this happens automatically:

```yaml
services:
  frametap:
    image: frametap/frametap-cli:latest
    environment:
      - FRAMETAP_TOKEN=${FRAMETAP_TOKEN}
      - FRAMETAP_AUTO_RECORD=true
      - FRAMETAP_JOB_NAME=CI Test
      - SE_GRID_URL=http://selenium:4444
      - DISPLAY=selenium:99
```

### Use Cases

- CI/CD pipelines
- Selenium/Playwright/Puppeteer tests
- Automated browser testing
- When test duration is variable

### Docker Compose Example

```yaml
version: '3.8'
services:
  selenium:
    image: selenium/standalone-chrome:latest
    shm_size: 2gb
    environment:
      - SE_NODE_MAX_SESSIONS=1
      - DISPLAY=:99
    ports:
      - "4444:4444"
      - "6099:6099"

  frametap:
    image: frametap/frametap-cli:latest
    environment:
      - FRAMETAP_TOKEN=${FRAMETAP_TOKEN}
      - FRAMETAP_AUTO_RECORD=true
      - SE_GRID_URL=http://selenium:4444
      - DISPLAY=selenium:99
    depends_on:
      - selenium

  test:
    image: python:3.11-slim
    environment:
      - SELENIUM_REMOTE_URL=http://selenium:4444/wd/hub
    depends_on:
      - selenium
    command: ["python", "test.py"]
```

## Choosing a Stop Condition

| Condition | Best For | Pros | Cons |
|-----------|----------|------|------|
| **Duration** | Fixed-length captures, demos | Simple, predictable | May cut off or waste time |
| **Interrupt** | Interactive, multi-stage, unknown duration | Flexible, manual control | Requires manual stop |
| **Selenium Idle** | CI/CD, automated tests | Automatic, matches test duration | Requires Selenium Grid |

## Combining Conditions

Currently, jobs support one stop condition at a time. For complex scenarios, create multiple jobs:

```python
# Start a recording with selenium_idle
job1 = create_job(stop_condition='selenium_idle')

# If test takes too long, have a backup
import threading

def timeout_stop():
    time.sleep(600)  # 10 minutes
    cancel_job(job1['id'])

# Start timeout thread
threading.Thread(target=timeout_stop, daemon=True).start()

# Run your test
run_test()  # Recording stops when Selenium goes idle
```

## Troubleshooting

### Duration doesn't stop at exact time

The runner checks stop conditions every few seconds, so there may be a small delay (typically < 5 seconds).

### Selenium idle doesn't trigger

**Check:**
- Grid URL is accessible from runner: `docker compose exec frametap curl http://selenium:4444/wd/hub/status`
- Selenium is actually starting sessions
- Auth credentials are correct (if using basic auth)
- Runner logs: `docker compose logs frametap`

### Interrupt condition times out

There is no built-in timeout for interrupt jobs. If you need one, cancel via API:

```python
import signal

class Timeout:
    def __init__(self, seconds):
        self.seconds = seconds
    
    def __enter__(self):
        def handler(signum, frame):
            raise TimeoutError()
        signal.signal(signal.SIGALRM, handler)
        signal.alarm(self.seconds)
    
    def __exit__(self, *args):
        signal.alarm(0)

# Use with context manager
with Timeout(300):  # 5 minutes
    run_recording(stop_condition='interrupt')
```

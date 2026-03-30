# Selenium Integration

Frametap integrates seamlessly with Selenium to record browser test sessions in CI/CD pipelines and local development.

## Overview

When running Selenium tests, Frametap can:
- Automatically record the entire browser session
- Detect when tests finish (via Selenium Grid idle detection)
- Upload recordings to the dashboard for review
- Capture screenshots at specific points

## Quick Start

### Docker Compose Setup

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
      - "6099:6099"  # X11 display
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
      - FRAMETAP_JOB_NAME=Selenium CI Test
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
    command: ["python", "selenium_test.py"]

volumes:
  frametap-data:
```

### Test Script (Python)

```python
#!/usr/bin/env python3
"""Selenium test with Frametap recording."""

import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


def main():
    remote_url = os.environ.get("SELENIUM_REMOTE_URL", "http://localhost:4444/wd/hub")
    
    # Configure Chrome
    options = webdriver.ChromeOptions()
    options.add_argument("--window-size=1280,720")
    options.add_argument("--window-position=0,0")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    driver = webdriver.Remote(command_executor=remote_url, options=options)
    
    try:
        wait = WebDriverWait(driver, 10)
        
        # Run your test
        print("Navigating to site...")
        driver.get("https://example.com")
        time.sleep(2)
        
        # Frametap is recording this entire session
        first_link = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "a"))
        )
        first_link.click()
        
        time.sleep(2)
        
        assert driver.title, "Expected page title"
        print("Test passed!")
        
    finally:
        driver.quit()
        # Recording automatically stops when Selenium becomes idle


if __name__ == "__main__":
    main()
```

### Dockerfile for Tests

```dockerfile
FROM python:3.11-slim

WORKDIR /tests

# Install dependencies
RUN pip install selenium webdriver-manager

# Copy test files
COPY selenium_test.py .

CMD ["python", "selenium_test.py"]
```

## How It Works

### Auto-Record Mode

When `FRAMETAP_AUTO_RECORD=true`, the runner:

1. **Starts on boot**: Begins recording immediately after connecting to backend
2. **Monitors Selenium**: Uses the Grid API to detect active sessions
3. **Auto-stops**: When Selenium has no active sessions for 5 seconds
4. **Uploads**: Automatically uploads the recording to the dashboard

### Stop Condition: `selenium_idle`

The runner queries the Selenium Grid status endpoint:
- `http://selenium:4444/wd/hub/status`

When the slot count drops to 0 and stays there for a grace period, the recording stops.

### Authentication

If your Selenium Grid uses basic auth:

```yaml
environment:
  - SE_GRID_URL=http://selenium:4444
  - SE_GRID_USERNAME=myuser
  - SE_GRID_PASSWORD=mypass
```

## Configuration Options

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `FRAMETAP_AUTO_RECORD` | Start recording on boot | `true` |
| `FRAMETAP_JOB_NAME` | Name for auto-recorded jobs | `E2E Tests` |
| `SE_GRID_URL` | Selenium Grid URL | `http://selenium:4444` |
| `SE_GRID_USERNAME` | Basic auth username | `user` |
| `SE_GRID_PASSWORD` | Basic auth password | `pass` |

### Manual Control

If you prefer manual control over auto-record:

```python
# Trigger recording via API before test
import requests

requests.post("https://api.frametap.io/v1/jobs", json={
    "type": "recording",
    "runnerId": 123,
    "displayId": ":0",
    "stopCondition": "selenium_idle",
    "stopConditionConfig": {
        "gridUrl": "http://selenium:4444",
        "gridUsername": "user",
        "gridPassword": "pass"
    }
})
```

## CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run tests with Frametap
        env:
          FRAMETAP_TOKEN: ${{ secrets.FRAMETAP_TOKEN }}
          FRAMETAP_AUTO_RECORD: "true"
        run: |
          docker compose -f compose.selenium.yaml up --abort-on-container-exit
      
      - name: Upload artifacts link
        if: failure()
        run: |
          echo "View recording at: https://frametap.io/recordings"
```

### GitLab CI

```yaml
e2e_tests:
  stage: test
  image: docker:20
  services:
    - docker:20-dind
  variables:
    FRAMETAP_TOKEN: $FRAMETAP_TOKEN
    FRAMETAP_AUTO_RECORD: "true"
  script:
    - docker compose -f compose.selenium.yaml up --abort-on-container-exit
```

## Best Practices

### 1. Set Window Size

Ensure consistent recording dimensions:

```python
options.add_argument("--window-size=1280,720")
options.add_argument("--window-position=0,0")
```

### 2. Use Health Checks

Wait for Selenium to be ready:

```yaml
depends_on:
  selenium:
    condition: service_healthy
```

### 3. Name Your Jobs

Use descriptive job names for organization:

```yaml
environment:
  - FRAMETAP_JOB_NAME="Cart Checkout Flow"
```

### 4. Persist Data

Mount a volume to preserve runner registration:

```yaml
volumes:
  - frametap-data:/home/frametap/.config/frametap
```

## Troubleshooting

### Recording doesn't start
- Check `FRAMETAP_AUTO_RECORD=true` is set
- Verify runner is enrolled: `frametap status`
- Check logs: `docker compose logs frametap`

### Recording doesn't stop
- Verify `SE_GRID_URL` is correct
- Check Selenium Grid is accessible from runner
- Try manual stop condition instead of `selenium_idle`

### Black screen in recording
- Ensure browser window is visible (not minimized)
- Check DISPLAY is correctly set
- Verify X11 display is working: `docker compose exec selenium xwd -root -out /tmp/screen.xwd`

### Test fails but no recording
- Ensure `depends_on` includes frametap service
- Check volume mounts for frametap-data
- Verify FRAMETAP_TOKEN is valid

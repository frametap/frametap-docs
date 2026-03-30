# Auto-Record Mode

Auto-record mode automatically starts recording when the Frametap runner starts up, perfect for CI/CD pipelines and automated testing.

## Overview

When `FRAMETAP_AUTO_RECORD=true` is set:

1. Runner connects to backend
2. Recording job is created automatically
3. Recording starts immediately
4. Stops based on configured condition
5. Automatically uploads to dashboard

## Basic Setup

### Environment Variables

```bash
export FRAMETAP_TOKEN=ft_enrollment_xxxxxxxxxxxxxxxxx
export FRAMETAP_AUTO_RECORD=true
export FRAMETAP_JOB_NAME="CI E2E Test Suite"
frametap up
```

### Docker Compose

```yaml
services:
  frametap:
    image: frametap/frametap-cli:latest
    environment:
      - FRAMETAP_TOKEN=${FRAMETAP_TOKEN}
      - FRAMETAP_AUTO_RECORD=true
      - FRAMETAP_JOB_NAME=Automated Test Recording
      - DISPLAY=:99
    volumes:
      - frametap-data:/home/frametap/.config/frametap

volumes:
  frametap-data:
```

## Stop Conditions

Auto-record uses the `selenium_idle` stop condition by default if `SE_GRID_URL` is set, otherwise falls back to manual interrupt.

### Selenium Idle (Recommended for CI)

```bash
export FRAMETAP_AUTO_RECORD=true
export SE_GRID_URL=http://selenium:4444
export FRAMETAP_JOB_NAME="Selenium Test Run"
```

**How it works:**
- Records continuously
- Monitors Selenium Grid status
- Stops when no active sessions for 5 seconds
- Perfect for Selenium/Playwright/Puppeteer tests

### Duration-Based

For fixed-length recordings:

```bash
# Not directly supported via env vars
# Use API call instead:
curl -X POST https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "type": "recording",
    "runnerId": 123,
    "stopCondition": "duration",
    "stopConditionConfig": {
      "durationSeconds": 300
    }
  }'
```

### Manual Interrupt

For manual control:

```bash
export FRAMETAP_AUTO_RECORD=true
# Don't set SE_GRID_URL
```

Then cancel via API:
```bash
curl -X POST https://api.frametap.io/v1/jobs/123/cancel \
  -H "Authorization: Bearer $API_KEY"
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Visual Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Start services
        env:
          FRAMETAP_TOKEN: ${{ secrets.FRAMETAP_TOKEN }}
          FRAMETAP_AUTO_RECORD: "true"
          FRAMETAP_JOB_NAME: "PR #${{ github.event.number }}"
        run: |
          docker compose -f docker-compose.test.yml up --abort-on-container-exit
      
      - name: Link to recording
        if: always()
        run: |
          echo "Recording available at: https://frametap.io/recordings"
          echo "Look for job: PR #${{ github.event.number }}"
```

### GitLab CI

```yaml
visual-test:
  stage: test
  image: docker:latest
  services:
    - docker:dind
  variables:
    FRAMETAP_TOKEN: $FRAMETAP_TOKEN
    FRAMETAP_AUTO_RECORD: "true"
    FRAMETAP_JOB_NAME: "$CI_COMMIT_REF_NAME"
  script:
    - docker compose -f docker-compose.test.yml up --abort-on-container-exit
  artifacts:
    reports:
      junit: test-results.xml
```

### Jenkins

```groovy
pipeline {
    agent any
    environment {
        FRAMETAP_TOKEN = credentials('frametap-token')
        FRAMETAP_AUTO_RECORD = 'true'
        FRAMETAP_JOB_NAME = "${env.BUILD_TAG}"
    }
    stages {
        stage('Test') {
            steps {
                sh 'docker compose -f docker-compose.test.yml up --abort-on-container-exit'
            }
        }
    }
    post {
        always {
            echo "Check https://frametap.io/recordings for: ${env.BUILD_TAG}"
        }
    }
}
```

## Multi-Stage Recordings

For tests with multiple phases:

```python
# test_phases.py
import requests

API_KEY = os.environ['FRAMETAP_API_KEY']
RUNNER_ID = int(os.environ['FRAMETAP_RUNNER_ID'])

def start_phase(name):
    """Start recording for a specific test phase."""
    response = requests.post(
        'https://api.frametap.io/v1/jobs',
        headers={'Authorization': f'Bearer {API_KEY}'},
        json={
            'type': 'recording',
            'runnerId': RUNNER_ID,
            'name': name,
            'stopCondition': 'interrupt'
        }
    )
    return response.json()['id']

def stop_phase(job_id):
    """Stop recording for a phase."""
    requests.post(
        f'https://api.frametap.io/v1/jobs/{job_id}/cancel',
        headers={'Authorization': f'Bearer {API_KEY}'}
    )

# Run tests
phase1_id = start_phase('Login Flow')
run_login_tests()
stop_phase(phase1_id)

phase2_id = start_phase('Checkout Flow')
run_checkout_tests()
stop_phase(phase2_id)
```

## Best Practices

### 1. Use Descriptive Job Names

Include context in job names:

```bash
FRAMETAP_JOB_NAME="${CI_COMMIT_REF_NAME} - ${CI_JOB_NAME}"
```

### 2. Persist Runner Data

Always mount a volume:

```yaml
volumes:
  - frametap-data:/home/frametap/.config/frametap
```

This prevents duplicate registrations and preserves checksums.

### 3. Set Appropriate Window Size

For consistent recordings:

```python
# In your Selenium test
options.add_argument("--window-size=1280,720")
options.add_argument("--window-position=0,0")
```

### 4. Handle Failures Gracefully

Use `--abort-on-container-exit` to ensure all logs are captured:

```bash
docker compose -f test.yml up --abort-on-container-exit
```

### 5. Link to Recordings in CI

Always print the dashboard URL:

```yaml
- name: Recording link
  if: always()
  run: |
    echo "📹 Recording: https://frametap.io/recordings"
    echo "🔍 Job: $FRAMETAP_JOB_NAME"
```

## Troubleshooting

### Recording doesn't start

**Check:**
- FRAMETAP_AUTO_RECORD is set to `true`
- FRAMETAP_TOKEN is valid
- Runner is enrolled: `frametap status`

### Recording doesn't stop

**Check:**
- For `selenium_idle`: SE_GRID_URL is correct
- Selenium is accessible from runner container
- Try `docker compose exec frametap frametap status`

### Multiple recordings created

**Cause:** Runner re-registered without persistent volume

**Fix:**
```yaml
volumes:
  - frametap-data:/home/frametap/.config/frametap
```

### Black screen

**Check:**
- DISPLAY is correctly set
- Browser window is visible (not minimized)
- X11 display is working

## Advanced: Conditional Auto-Record

Use shell logic for conditional recording:

```bash
#!/bin/bash
# conditional_record.sh

if [[ "$CI_JOB_STAGE" == "e2e" ]] && [[ "$CI_COMMIT_BRANCH" != "main" ]]; then
  export FRAMETAP_AUTO_RECORD=true
  export FRAMETAP_JOB_NAME="E2E-${CI_COMMIT_SHORT_SHA}"
fi

frametap up --token $FRAMETAP_TOKEN
```

# Auto-Record Mode

Auto-record mode automatically starts recording when the Frametap runner starts up, perfect for CI/CD pipelines and automated testing.

## Overview

When `FRAMETAP_AUTO_RECORD=true` is set:

1. Runner starts and checks in with Frametap
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
    image: frametap/frametap:latest
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
- Perfect for Selenium tests

### Manual Interrupt

If you start an auto-recording without `SE_GRID_URL`, it uses manual interrupt and keeps recording until you stop the job.

```bash
export FRAMETAP_AUTO_RECORD=true
# Don't set SE_GRID_URL
```

You can stop it in two ways:

1. Via API:

```bash
curl -X POST "https://api.frametap.io/v1/jobs/123/cancel?organizationId=$FRAMETAP_ORG_ID" \
  -H "Authorization: Bearer $FRAMETAP_API_KEY"
```

2. In the app UI:

- open [Jobs](https://frametap.io/app/jobs)
- click the `...` action for the running job to open the drawer
- click the cancel button at the top of the drawer

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

## Troubleshooting

### Recording doesn't start

**Check:**
- FRAMETAP_AUTO_RECORD is set to `true`
- FRAMETAP_TOKEN is valid
- Runner is enrolled: `frametap status`
- Stop any previous auto-record session first with `frametap down`, then start the runner again

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

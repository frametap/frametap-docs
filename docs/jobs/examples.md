# Job Examples

Practical examples for common Frametap use cases.

## Table of Contents

- [Basic Recording](#basic-recording)
- [Screenshot at Specific Time](#screenshot-at-specific-time)
- [Selenium Test Recording](#selenium-test-recording)
- [Scheduled Screenshots](#scheduled-screenshots)
- [Multi-Stage Recording](#multi-stage-recording)
- [Watch Folder for Artifacts](#watch-folder-for-artifacts)
- [CI/CD Integration](#cicd-integration)
- [Playwright Integration](#playwright-integration)
- [Puppeteer Integration](#puppeteer-integration)
- [Error Recovery](#error-recovery)

## Basic Recording

Record a 60-second video of your screen.

```bash
curl -X POST https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "runnerId": 123,
    "type": "recording",
    "displayId": ":0",
    "name": "Desktop Demo",
    "stopCondition": "duration",
    "stopConditionConfig": {
      "durationSeconds": 60
    }
  }'
```

## Screenshot at Specific Time

Trigger a screenshot during a test:

```python
import requests
import time

API_KEY = 'ft_api_...'
RUNNER_ID = 123

def capture_screenshot(name):
    """Capture and return screenshot URL."""
    response = requests.post(
        'https://api.frametap.io/v1/jobs',
        headers={
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json'
        },
        json={
            'runnerId': RUNNER_ID,
            'type': 'screenshot',
            'displayId': ':0',
            'name': name
        }
    )
    job = response.json()
    
    # Wait for completion
    while True:
        status = requests.get(
            f'https://api.frametap.io/v1/jobs/{job["id"]}',
            headers={'Authorization': f'Bearer {API_KEY}'}
        ).json()
        
        if status['status'] == 'completed':
            # Get document URL
            doc_id = status['documentId']
            doc = requests.get(
                f'https://api.frametap.io/v1/documents/{doc_id}',
                headers={'Authorization': f'Bearer {API_KEY}'}
            ).json()
            return doc['files'][0]['url']
        
        elif status['status'] == 'failed':
            raise Exception(f"Screenshot failed: {status}")
        
        time.sleep(1)

# Usage
print(f"Screenshot: {capture_screenshot('Login Page')}")
```

## Selenium Test Recording

Full Selenium test with automatic recording:

```yaml
# docker-compose.yml
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

  frametap:
    image: frametap/frametap-cli:latest
    environment:
      - FRAMETAP_TOKEN=${FRAMETAP_TOKEN}
      - FRAMETAP_AUTO_RECORD=true
      - FRAMETAP_JOB_NAME=${CI_JOB_NAME:-Selenium Test}
      - SE_GRID_URL=http://selenium:4444
      - DISPLAY=selenium:99
    volumes:
      - frametap-data:/home/frametap/.config/frametap

  test:
    build: .
    environment:
      - SELENIUM_REMOTE_URL=http://selenium:4444/wd/hub
    depends_on:
      - selenium
```

```python
# test.py
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import time

def test_checkout_flow():
    options = webdriver.ChromeOptions()
    options.add_argument("--window-size=1280,720")
    
    driver = webdriver.Remote(
        command_executor=os.environ['SELENIUM_REMOTE_URL'],
        options=options
    )
    
    try:
        wait = WebDriverWait(driver, 10)
        
        # Navigate to site
        driver.get("https://example-shop.com")
        
        # Add item to cart
        add_button = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-test='add-to-cart']"))
        )
        add_button.click()
        
        # Go to cart
        cart_link = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/cart']"))
        )
        cart_link.click()
        
        # Verify in cart
        time.sleep(1)
        assert "Your Cart" in driver.title
        
        print("✓ Test passed!")
        
    finally:
        driver.quit()
        # Recording automatically stops here (selenium_idle)

if __name__ == "__main__":
    test_checkout_flow()
```

## Scheduled Screenshots

Take screenshots every 5 minutes for monitoring:

```bash
curl -X POST https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "runnerId": 123,
    "type": "screenshot",
    "displayId": ":0",
    "name": "Dashboard Monitor",
    "scheduleIntervalS": 300,
    "scheduleEndAt": "2026-03-29T00:00:00Z"
  }'
```

## Multi-Stage Recording

Record different phases of a complex test separately:

```python
import requests
import time
import concurrent.futures

API_KEY = 'ft_api_...'
RUNNER_ID = 123

def start_recording(name):
    """Start a recording job."""
    response = requests.post(
        'https://api.frametap.io/v1/jobs',
        headers={
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json'
        },
        json={
            'runnerId': RUNNER_ID,
            'type': 'recording',
            'displayId': ':0',
            'name': name,
            'stopCondition': 'interrupt'
        }
    )
    return response.json()['id']

def stop_recording(job_id):
    """Stop a recording job."""
    requests.post(
        f'https://api.frametap.io/v1/jobs/{job_id}/cancel',
        headers={'Authorization': f'Bearer {API_KEY}'}
    )

def run_test_phase(phase_name, test_func):
    """Run a test phase with its own recording."""
    job_id = start_recording(phase_name)
    print(f"📹 Started recording: {phase_name}")
    
    try:
        test_func()
        print(f"✓ {phase_name} passed")
    except Exception as e:
        print(f"✗ {phase_name} failed: {e}")
        raise
    finally:
        stop_recording(job_id)
        print(f"⏹ Stopped recording: {phase_name}")

def test_login():
    # Run login tests
    time.sleep(2)

def test_browse():
    # Run browse tests
    time.sleep(3)

def test_checkout():
    # Run checkout tests
    time.sleep(2)

# Run all phases
run_test_phase("Phase 1: Login", test_login)
run_test_phase("Phase 2: Browse", test_browse)
run_test_phase("Phase 3: Checkout", test_checkout)
```

## Watch Folder for Artifacts

Automatically upload test artifacts:

```yaml
# docker-compose.yml
services:
  test-runner:
    build: .
    volumes:
      - ./output:/app/output
    command: ["npm", "test"]

  frametap:
    image: frametap/frametap-cli:latest
    environment:
      - FRAMETAP_TOKEN=${FRAMETAP_TOKEN}
      - FRAMETAP_WATCH_DIR=/app/output
      - FRAMETAP_WATCH_EXCLUDE=[*.log, node_modules/**]
    volumes:
      - ./output:/app/output:ro
      - frametap-data:/home/frametap/.config/frametap
```

```javascript
// playwright.config.js
module.exports = {
  reporter: [
    ['html', { outputFolder: '/app/output/playwright-report' }],
    ['json', { outputFile: '/app/output/results.json' }]
  ],
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
};
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
      
      - name: Run tests with recording
        env:
          FRAMETAP_TOKEN: ${{ secrets.FRAMETAP_TOKEN }}
          FRAMETAP_AUTO_RECORD: "true"
          FRAMETAP_JOB_NAME: "${{ github.event_name }} - ${{ github.sha }}"
        run: |
          docker compose -f docker-compose.test.yml up --abort-on-container-exit
      
      - name: Link to recording
        if: always()
        run: |
          echo "📹 View recording at: https://frametap.io/recordings"
          echo "🔍 Job: ${{ github.event_name }} - ${{ github.sha }}"
```

### GitLab CI

```yaml
visual_tests:
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
    when: always
    reports:
      junit: test-results.xml
```

## Playwright Integration

```python
# test_with_frametap.py
from playwright.sync_api import sync_playwright
import requests
import os

API_KEY = os.environ['FRAMETAP_API_KEY']
RUNNER_ID = int(os.environ['FRAMETAP_RUNNER_ID'])

def start_recording():
    """Start a recording via API."""
    response = requests.post(
        'https://api.frametap.io/v1/jobs',
        headers={'Authorization': f'Bearer {API_KEY}'},
        json={
            'runnerId': RUNNER_ID,
            'type': 'recording',
            'displayId': ':0',
            'stopCondition': 'interrupt'
        }
    )
    return response.json()['id']

def stop_recording(job_id):
    """Stop the recording."""
    requests.post(
        f'https://api.frametap.io/v1/jobs/{job_id}/cancel',
        headers={'Authorization': f'Bearer {API_KEY}'}
    )

def test_with_playwright():
    job_id = start_recording()
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={'width': 1280, 'height': 720})
            
            # Navigate and interact
            page.goto('https://example.com')
            page.click('text=Get Started')
            page.wait_for_load_state('networkidle')
            
            # Take screenshot via Frametap too
            requests.post(
                'https://api.frametap.io/v1/jobs',
                headers={'Authorization': f'Bearer {API_KEY}'},
                json={
                    'runnerId': RUNNER_ID,
                    'type': 'screenshot',
                    'displayId': ':0',
                    'name': 'After Get Started'
                }
            )
            
            browser.close()
    finally:
        stop_recording(job_id)

if __name__ == '__main__':
    test_with_playwright()
```

## Puppeteer Integration

```javascript
// test_with_frametap.js
const puppeteer = require('puppeteer');
const axios = require('axios');

const API_KEY = process.env.FRAMETAP_API_KEY;
const RUNNER_ID = parseInt(process.env.FRAMETAP_RUNNER_ID);

async function startRecording() {
  const response = await axios.post(
    'https://api.frametap.io/v1/jobs',
    {
      runnerId: RUNNER_ID,
      type: 'recording',
      displayId: ':0',
      stopCondition: 'interrupt'
    },
    { headers: { Authorization: `Bearer ${API_KEY}` } }
  );
  return response.data.id;
}

async function stopRecording(jobId) {
  await axios.post(
    `https://api.frametap.io/v1/jobs/${jobId}/cancel`,
    {},
    { headers: { Authorization: `Bearer ${API_KEY}` } }
  );
}

async function runTest() {
  const jobId = await startRecording();
  console.log(`Started recording: ${jobId}`);
  
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    await page.goto('https://example.com');
    await page.click('a');
    await page.waitForNavigation();
    
    await browser.close();
    console.log('Test completed');
  } finally {
    await stopRecording(jobId);
    console.log('Stopped recording');
  }
}

runTest().catch(console.error);
```

## Error Recovery

Handle failures gracefully with screenshots:

```python
import requests
import sys
import traceback

API_KEY = '...'
RUNNER_ID = 123

def capture_error_screenshot(name="error"):
    """Capture a screenshot when something fails."""
    try:
        requests.post(
            'https://api.frametap.io/v1/jobs',
            headers={'Authorization': f'Bearer {API_KEY}'},
            json={
                'runnerId': RUNNER_ID,
                'type': 'screenshot',
                'displayId': ':0',
                'name': f'Error: {name}'
            }
        )
    except Exception as e:
        print(f"Failed to capture error screenshot: {e}")

def run_test_with_recovery(test_func):
    """Run a test with error handling and automatic screenshot."""
    try:
        test_func()
    except Exception as e:
        print(f"❌ Test failed: {e}")
        traceback.print_exc()
        
        # Capture the error state
        capture_error_screenshot(test_func.__name__)
        
        # Re-raise to fail the test
        raise

def flaky_test():
    """A test that might fail."""
    import random
    if random.random() < 0.5:
        raise Exception("Random failure!")
    print("✓ Test passed")

# Run with recovery
run_test_with_recovery(flaky_test)
```

## Tips & Tricks

### Naming Conventions

Use consistent naming for organization:

```python
job_name = f"{CI_JOB_NAME} - {TEST_NAME} - {timestamp}"
```

### Parallel Jobs

Run multiple jobs on the same runner:

```python
import concurrent.futures

def run_job(job_config):
    requests.post('https://api.frametap.io/v1/jobs', ...)

with concurrent.futures.ThreadPoolExecutor() as executor:
    jobs = [
        {'type': 'screenshot', 'name': 'Before'},
        {'type': 'recording', 'name': 'During', 'stopCondition': 'interrupt'},
        {'type': 'screenshot', 'name': 'After'}
    ]
    executor.map(run_job, jobs)
```

### Cleanup

Always clean up jobs after use:

```python
import atexit

active_jobs = []

def cleanup():
    for job_id in active_jobs:
        try:
            requests.delete(
                f'https://api.frametap.io/v1/jobs/{job_id}',
                headers={'Authorization': f'Bearer {API_KEY}'}
            )
        except:
            pass

atexit.register(cleanup)
```

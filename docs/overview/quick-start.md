# Quick Start

Get up and running with Frametap in under 5 minutes.

## Prerequisites

- A Frametap account (sign up at [frametap.io](https://frametap.io))
- An enrollment token from your dashboard

## Step 1: Install the CLI

```bash
curl -fsSL https://cli.frametap.io/install | bash
```

This installs the `frametap` CLI tool to your system.

## Step 2: Enroll Your Runner

Get your enrollment token from the Frametap dashboard ([Settings → API Keys](https://frametap.io/app/settings/)), then run:

```bash
frametap up --token ft_enrollment_xxxxxxxxxxxxxxxxx
```

This registers your machine as a runner and starts the daemon.

Verify it's working:

```bash
frametap status
```

You should see version, uptime, and runner information.

## Step 3: Trigger Your First Recording

### Option A: Via Dashboard (Easiest)

The easiest way to trigger your first recording is directly from the dashboard:

1. Go to your [Frametap dashboard](https://frametap.io)
2. Navigate to "Jobs"
3. Click "Create Job"
4. Select your runner and job type
5. Click "Start"

Your runner will immediately start recording and upload the result.

### Option B: Via API

::: info Prerequisites for API Control
Before using the API, you need to create an API key:

1. Go to your [Frametap dashboard Settings page](https://frametap.io/app/settings/)
2. Navigate to **API Keys**
3. Click **"Create API Key"**
4. Copy your API key (starts with `ft_api_...`)
5. Set it as an environment variable: `export API_KEY=ft_api_xxxxxxxx`
:::

```bash
# Set your API key
export API_KEY=ft_api_xxxxxxxxxxxxxxxxx

# Get your runner ID from the dashboard or CLI
RUNNER_ID=123

# Create a recording job via API
curl -X POST https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "recording",
    "runnerId": '"$RUNNER_ID"',
    "displayId": ":0",
    "stopCondition": "duration",
    "stopConditionConfig": {
      "durationSeconds": 30
    }
  }'
```

### Option C: Auto-Record Mode

Set the `FRAMETAP_AUTO_RECORD` environment variable:

```bash
export FRAMETAP_TOKEN=ft_enrollment_xxxxxxxxxxxxxxxxx
export FRAMETAP_AUTO_RECORD=true
export FRAMETAP_JOB_NAME="My Test Recording"

frametap up
```

The runner will automatically start recording when it starts up.

## Step 4: View the Result

1. Go to your [Frametap dashboard](https://frametap.io)
2. Navigate to "Recordings"
3. You'll see your recording with timeline view

## Next Steps

- [Learn about job types](/jobs/types)
- [Set up watch folder uploads](/jobs/watch-folder)
- [Integrate with Selenium](/installation/selenium)
- [Explore CLI commands](/cli/commands)

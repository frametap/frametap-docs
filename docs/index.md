# Frametap Documentation

API controlled screen capture from sandboxes, containers, VMs, and remote machines.

> Start in the app at [frametap.io/app](https://frametap.io/app) and use the full API reference at [api-reference.frametap.io](https://api-reference.frametap.io/).

## Getting Started

<div class="grid grid-cols-2 gap-4">
  <div class="p-4 border rounded">
    <h3>Quick Start</h3>
    <p>Get up and running in 5 minutes</p>
    <a href="/overview/quick-start" class="button">Get Started →</a>
  </div>
  <div class="p-4 border rounded">
    <h3>Open App</h3>
    <p>Enroll runners, create jobs, and review artifacts in the UI</p>
    <a href="https://frametap.io/app" class="button">Open App →</a>
  </div>
  <div class="p-4 border rounded">
    <h3>Install CLI</h3>
    <p>Install the Frametap runner on your machines</p>
    <a href="/installation/cli" class="button">Install →</a>
  </div>
  <div class="p-4 border rounded">
    <h3>API Reference</h3>
    <p>Interactive API docs and the OpenAPI spec</p>
    <a href="https://api-reference.frametap.io/" class="button">API →</a>
  </div>
</div>

## What is Frametap?

Frametap helps you capture and review what actually happened on remote machines:

- **Screenshots** from any enrolled display
- **Recordings** with duration, interrupt, or Selenium-aware stop conditions
- **File uploads** from watched artifact folders

## How it works

```
Install runner → Trigger from app, API, or CLI → Review artifacts in the app
```

1. **Install** the Frametap CLI on the machine that should capture or upload files
2. **Enroll** that machine as a runner
3. **Trigger** jobs from the app, public API, or CLI
4. **Review** recordings, screenshots, and uploaded files in Frametap

## Use Cases

- **CI/CD Pipelines** - Record browser tests for debugging
- **AI Agents** - Capture visual proof from sandboxed runs
- **Remote Debugging** - Capture from production-like environments
- **Automated Monitoring** - Schedule screenshots and collect artifacts

## Quick Example

```bash
# Install the runner
curl -fsSL https://cli.static.frametap.io/install | bash

# Enroll the machine
frametap up --token ft_enrollment_xxxxxxxxxxxxxxxxx

# Create a recording job via API
export FRAMETAP_API_KEY=ft_api_xxxxxxxxxxxxxxxxx
export FRAMETAP_ORG_ID=123

curl -X POST "https://api.frametap.io/v1/jobs?organizationId=$FRAMETAP_ORG_ID" \
  -H "Authorization: Bearer $FRAMETAP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "runnerId": 123,
    "displayId": "0",
    "type": "recording",
    "stopCondition": "duration",
    "stopConditionConfig": {"durationSeconds": 60}
  }'

# Or watch an artifact folder from the CLI
frametap watch start --dir /app/artifacts
```

## Documentation Sections

### [Overview](/overview/)
- What Frametap does
- Customer workflow
- Quick start
- Using the app

### [Installation](/installation/cli)
- Install CLI
- Docker setup
- Selenium integration

### [CLI Reference](/cli/commands)
- Commands
- Environment variables
- Auto-record mode

### [Jobs](/jobs/types)
- Job types
- Stop conditions
- Watch folder
- Examples

### [API](/api/overview)
- API overview
- Authentication
- Interactive API reference

### [Platform](/platform/runners)
- Runners
- Projects
- Documents
- Billing

## Resources

- **Open App**: [frametap.io/app](https://frametap.io/app)
- **API Reference**: [api-reference.frametap.io](https://api-reference.frametap.io/)
- **OpenAPI Spec**: [api-reference.frametap.io/openapi.json](https://api-reference.frametap.io/openapi.json)
- **Support**: hello@frametap.io

## Contributing

Found an issue or have a suggestion?

- Report issues on [GitHub](https://github.com/frametap)
- Email: hello@frametap.io

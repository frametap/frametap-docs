# Frametap Documentation

API controlled screen capture from sandboxes, containers, VMs, and remote machines.

## Getting Started

<div class="grid grid-cols-2 gap-4">
  <div class="p-4 border rounded">
    <h3>Quick Start</h3>
    <p>Get up and running in 5 minutes</p>
    <a href="/overview/quick-start" class="button">Get Started →</a>
  </div>
  <div class="p-4 border rounded">
    <h3>Install CLI</h3>
    <p>Install the Frametap CLI on your machines</p>
    <a href="/installation/cli" class="button">Install →</a>
  </div>
  <div class="p-4 border rounded">
    <h3>CLI Reference</h3>
    <p>Complete CLI command reference</p>
    <a href="/cli/commands" class="button">Reference →</a>
  </div>
  <div class="p-4 border rounded">
    <h3>API Docs</h3>
    <p>Full API specification with examples</p>
    <a href="/api/overview" class="button">API →</a>
  </div>
</div>

## What is Frametap?

Frametap enables you to programmatically capture:

- **Screenshots** - Single frame captures from any display
- **Screen Recordings** - Video capture with flexible stop conditions
- **File Uploads** - Watch folder monitoring with auto-upload

## How it works

```
Install runner → Trigger via API/CLI → Review artifacts in dashboard
```

1. **Install** the Frametap CLI on your machine
2. **Enroll** the runner with a token
3. **Trigger** captures via API or auto-record
4. **Review** in the web dashboard

## Use Cases

- **CI/CD Pipelines** - Record browser tests for debugging
- **AI Agents** - Capture visual proof from sandboxed runs
- **Remote Debugging** - Capture from production servers
- **Automated Monitoring** - Scheduled screenshots

## Quick Example

```bash
# Install
curl -fsSL https://cli.frametap.io/install | bash

# Enroll
frametap up --token ft_enrollment_xxxxxxxxxxxxxxxxx

# Create recording via API
curl -X POST https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "runnerId": 123,
    "type": "recording",
    "stopCondition": "duration",
    "stopConditionConfig": {"durationSeconds": 60}
  }'
```

## Documentation Sections

### [Overview](/overview/)
- What is Frametap
- Core capabilities
- Architecture

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
- Endpoints
- WebSocket

### [Platform](/platform/runners)
- Runners
- Projects
- Documents
- Billing

## Resources

- **API Reference**: [frametap.io/api](https://frametap.io/api)
- **Status Page**: [status.frametap.io](https://status.frametap.io)
- **Support**: hello@frametap.io

## Contributing

Found an issue or have a suggestion? 

- Report issues on [GitHub](https://github.com/frametap)
- Email: hello@frametap.io

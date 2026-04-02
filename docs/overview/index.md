# Frametap Documentation

Frametap lets you capture screenshots, screen recordings, and file uploads from sandboxes, containers, VMs, and remote machines.

## What is Frametap?

Frametap installs a runner on the machine you care about, then lets you trigger jobs from the app, the public API, or the CLI. The results come back to the app as recordings, screenshots, and uploaded files.

## Start Here

- Use the app: [frametap.io/app](https://frametap.io/app)
- Use the API reference: [api-reference.frametap.io](https://api-reference.frametap.io/)

## How it works

```
Install runner → Trigger jobs → Review artifacts in the app
```

1. **Install the Frametap CLI** on your machine, container, or VM
2. **Enroll the runner** with an enrollment token
3. **Trigger jobs** from the app, public API, or CLI commands
4. **Review artifacts** in the web app

## Core Capabilities

### Screenshots
Capture single frames from any enrolled display.

- On-demand screenshots
- Scheduled screenshots
- Organized in the dashboard with metadata

### Screen Recordings
Record video from any enrolled display.

- Duration-based recordings
- Manual interrupt
- Selenium-aware stop conditions for browser automation

### Watch Folder Uploads
Watch a directory and upload files automatically.

- Good for test artifacts, exports, logs, and generated files
- Built-in deduplication
- Include and exclude pattern support

## Common Use Cases

### Remote Sandboxes and VMs
Install the runner once, then trigger captures remotely whenever you need visual proof.

### AI Agent Workflows
Capture what an agent actually rendered or produced in its sandbox.

### CI/CD Debugging
Record browser runs and collect output files so failures are easier to inspect.

### Artifact Management
Keep screenshots, recordings, and uploaded files in one timeline.

## Ways to Use Frametap

### Dashboard
Create jobs manually, inspect artifacts, manage keys and billing, and monitor runners.

### Public API
Integrate Frametap into CI, automation, and custom tooling.

### CLI Runner
Manage the local runner, enable auto-recording, and watch folders directly from the command line.

## Getting Started

Start with one of these:

- [Quick Start](/overview/quick-start)
- [Using the App](/overview/app)
- [Install the CLI](/installation/cli)
- [Docker setup](/installation/docker)
- [CLI commands reference](/cli/commands)
- [API overview](/api/overview)
- [Interactive API reference](/reference/api-spec)

## Support

- **Documentation**: You're looking at it
- **Open App**: [frametap.io/app](https://frametap.io/app)
- **API Reference**: [api-reference.frametap.io](https://api-reference.frametap.io/)
- **OpenAPI Spec**: [api-reference.frametap.io/openapi.json](https://api-reference.frametap.io/openapi.json)
- **Email**: hello@frametap.io

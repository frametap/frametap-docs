# Frametap Documentation

Welcome to the Frametap documentation. Frametap is an API-controlled screen capture platform that lets you capture screenshots, screen recordings, and file uploads from sandboxes, containers, VMs, and remote machines.

## What is Frametap?

Frametap enables developers to programmatically capture visual artifacts from any machine where the Frametap CLI runner is installed. Whether you're debugging CI/CD pipelines, monitoring AI agent workflows, or managing remote infrastructure, Frametap brings back visual proof of what happened.

## How it works

```
Install runner → Trigger via API/CLI → Review artifacts in dashboard
```

1. **Install the Frametap CLI** on your machine, container, or VM
2. **Enroll the runner** with an enrollment token
3. **Trigger captures** via API calls or CLI commands
4. **Review artifacts** in the web dashboard with timeline view

## Core Capabilities

### Screenshots
Capture single frames from any display with API calls. Returns signed URLs for immediate download.

- Single display or window capture
- Scheduled screenshots
- Metadata extraction (dimensions, format)

### Screen Recordings
Record video from any display with flexible stop conditions:

- Duration-based (record for N seconds)
- Manual interrupt
- Selenium idle detection (stops when browser is idle)

### Watch Folder Uploads
Monitor directories for new files and auto-upload with checksum deduplication:

- Auto-detect file types (image, video, document, other)
- Metadata extraction (dimensions, codec, duration)
- Deduplication via SHA256 checksum
- Glob pattern exclusions

## Common Use Cases

### Remote Sandboxes & VMs
Install the runner once, then trigger captures from anywhere through API calls. Perfect for debugging ephemeral environments.

### AI Agent Workflows
When agents run code in isolated environments, Frametap brings back visual artifacts so humans can review what happened.

### CI/CD Debugging
Record browser sessions in pipelines and inspect exactly what happened when tests fail in headless environments. Works with Selenium, Playwright, and Puppeteer.

### Artifact Management
Auto-upload, dedupe, and organize screenshots, videos, and logs in one searchable timeline.

## Architecture Overview

Frametap consists of three main components:

### CLI Runner (frametap)
Go-based daemon that runs on target machines:
- Captures screenshots and recordings via ffmpeg
- Monitors watch folders
- Communicates with backend via WebSocket
- Handles file uploads with presigned URLs

### Backend API
FastAPI service for orchestration:
- Job management and scheduling
- Runner registration and heartbeat
- Authentication and billing
- Document storage and retrieval

### Web Dashboard
Vue.js interface for management:
- View recordings, screenshots, and files
- Manage runners and jobs
- Real-time status via WebSocket
- Credit-based billing management

## Getting Started

Check out the [Quick Start guide](/overview/quick-start) to get up and running in minutes, or dive into specific sections:

- [Install the CLI](/installation/cli)
- [Docker setup](/installation/docker)
- [CLI commands reference](/cli/commands)
- [Job types](/jobs/types)

## Support

- **Documentation**: You're looking at it!
- **API Reference**: [frametap.io/api](https://frametap.io/api)
- **Status Page**: [status.frametap.io](https://status.frametap.io)
- **Email**: hello@frametap.io

# Job Types

Jobs are the main execution primitive in Frametap. They tell a runner what to capture, upload, or watch.

Use this page to understand how jobs behave. For exact request and response schemas, use the Jobs section of the API reference:

- [Jobs endpoints](https://api-reference.frametap.io/#tag/jobs)

## Overview

Frametap currently revolves around three public job types:

| Job Type | What it does | Usually started from |
|----------|--------------|----------------------|
| `recording` | Captures a video from a display | App, CLI, or API |
| `screenshot` | Captures a single frame from a display | App, CLI, or API |
| `file_upload` | Uploads files that appear in a watched directory | Runner watch-folder config |

## Recording Jobs

Recording jobs capture a video from a specific display on a runner.

Use recordings when you want:

- browser test replays
- CI debugging
- interactive repro videos
- visual proof from remote machines or sandboxes

Recording jobs are the most configurable job type because they support multiple stop conditions.

You can start a recording directly from the runner with the CLI:

```bash
frametap recording start --display :0 --duration 30 --name "Checkout smoke test"
```

If you omit `--duration`, the recording runs as an interrupt recording until you stop it:

```bash
frametap recording stop
```

Supported stop conditions:

- `duration`
- `interrupt`
- `selenium_idle`

See [Stop Conditions](/jobs/stop-conditions) for details.

## Screenshot Jobs

Screenshot jobs capture a single still image from a display.

Use screenshots when you want:

- one-off visual checks
- lightweight monitoring
- scheduled snapshots
- fast captures without recording video

Screenshots are the simplest Frametap job type and are commonly used manually in [Jobs](https://frametap.io/app/jobs), directly from a runner with the CLI, or programmatically through the API.

```bash
frametap screenshot --display :0 --name "Dashboard state"
```

## File Upload Jobs

`file_upload` is still a Frametap job type, but it is typically triggered by the runner watching a directory for new files instead of being created manually like a recording or screenshot.

When a watched file appears, Frametap processes it as an upload job and the resulting artifact appears in [Recordings](https://frametap.io/app/recordings) alongside recordings and screenshots.

The usual way to trigger file uploads is to configure a watch folder on the runner:

```bash
frametap watch start --dir /app/output --exclude "*.tmp"
```

Or via environment variables:

```bash
export FRAMETAP_WATCH_DIR=/app/output
export FRAMETAP_WATCH_EXCLUDE="[*.tmp, *.log]"
frametap up
```

See [Watch Folder](/jobs/watch-folder) for the full workflow.

## One-Time vs Recurring Jobs

Frametap jobs can run once or on a recurring interval.

In [Jobs](https://frametap.io/app/jobs), the create-job flow lets users choose:

- `once`
- `recurring`

Recurring jobs are useful for:

- periodic screenshots
- repeated health checks
- regular recordings on a schedule

For recurring jobs:

- the job repeats on a configured interval
- you can optionally define an end time
- recurring recordings use a fixed duration rather than manual interrupt

If you need exact scheduling fields and payloads, use the create-job endpoint in the API reference.

## Stop Conditions

Only recording jobs use stop conditions.

The main choices are:

- `duration` for fixed-length recordings
- `interrupt` for recordings you stop manually
- `selenium_idle` for Selenium-based automation

See [Stop Conditions](/jobs/stop-conditions) for examples and behavior details.

## Cancelling Jobs

Running jobs can be cancelled in a few ways:

### In the App

1. Open [Jobs](https://frametap.io/app/jobs)
2. Click the `...` action for the running job
3. Open the drawer
4. Click the cancel button at the top

### Via API

Use the API reference for the exact cancel endpoint and request shape:

- [Cancel job endpoint](https://api-reference.frametap.io/#tag/jobs/POST/v1/jobs/{id}/cancel)

This is especially relevant for `interrupt` recordings, which keep running until they are manually stopped.

### Via CLI

If you started an interrupt recording from the runner CLI, stop it from the same runner:

```bash
frametap recording stop
```

## Job Status

Jobs move through a small set of lifecycle states:

- `queued`
- `running`
- `completed`
- `failed`
- `cancelled`

These states appear in [Jobs](https://frametap.io/app/jobs) and through the API.

## Job Events

Each job also emits progress events.

Examples:

- recordings emit events like recording started, uploading, completed, or failed
- screenshots emit capture and failure events
- file uploads emit upload progress and completion events

These are useful when building automation or troubleshooting a workflow.

## Where to Use Which Surface

### Use the App when you want to:

- create one-off jobs quickly
- inspect runner and display choices visually
- stop running jobs manually
- browse recordings, screenshots, and uploaded files

### Use the API when you want to:

- create recordings and screenshots programmatically
- schedule recurring jobs from your own tooling
- list, filter, cancel, or inspect jobs from automation

### Use the CLI when you want to:

- start one-off recordings or screenshots from the runner itself
- configure watch folders
- manage local runner state
- set up auto-record behavior on the runner itself

## Related Pages

- [Stop Conditions](/jobs/stop-conditions)
- [CLI Commands](/cli/commands)
- [Watch Folder](/jobs/watch-folder)
- [API Overview](/api/overview)
- [Jobs endpoints](https://api-reference.frametap.io/#tag/jobs)

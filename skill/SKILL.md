---
name: frametap
description: Guides agents through using Frametap.io for API-controlled screenshots, screen recordings, Selenium/CI captures, runner enrollment, watch-folder uploads, and Frametap API/CLI workflows. Use when the user mentions Frametap, Frametap.io, frametap.io, frametap CLI, frametap runner, recording remote machines, screenshots, screen capture, Selenium recordings, CI visual artifacts, or uploaded artifacts.
---

# Frametap.io

Frametap is an API-controlled screen capture platform for sandboxes, containers, VMs, CI jobs, and remote machines. Install a runner on the machine that should capture/upload artifacts, trigger jobs from the app/API/CLI, then review recordings, screenshots, and uploads in the web app.

## Start here

- App: https://frametap.io/app
- Docs: https://docs.frametap.io/
- API reference: https://api-reference.frametap.io/
- OpenAPI spec: https://api-reference.frametap.io/openapi.json

If working inside the `frametap-docs` repository, first read the relevant local docs under `docs/` instead of guessing. Useful entry points:

- `docs/index.md` — overview and links
- `docs/overview/quick-start.md` — fastest end-to-end setup
- `docs/installation/cli.md` — runner install/enrollment/troubleshooting
- `docs/installation/docker.md` and `docs/installation/selenium.md` — container/Selenium workflows
- `docs/cli/commands.md` and `docs/cli/environment.md` — CLI and env vars
- `docs/jobs/types.md`, `docs/jobs/stop-conditions.md`, `docs/jobs/watch-folder.md` — job behavior
- `docs/api/overview.md` and `docs/api/authentication.md` — API usage

## Mental model

```
Install runner → Enroll runner → Trigger jobs → Review artifacts in app
```

1. Install the Frametap CLI/runner on the target machine, container, VM, or sandbox.
2. Enroll it with a runner enrollment token (`ft_enrollment_...`).
3. Trigger screenshots, recordings, or watch-folder uploads from the app, public API, or local CLI.
4. Review recordings, screenshots, and uploaded files in https://frametap.io/app.

## Credentials and safety

- API keys look like `ft_api_...` and are used with the public API.
- Runner enrollment tokens look like `ft_enrollment_...` and are used to enroll machines.
- Never invent, print, or commit real Frametap credentials.
- Prefer environment variables in examples: `FRAMETAP_API_KEY`, `FRAMETAP_ORG_ID`, `FRAMETAP_TOKEN`.
- If a task requires a real token or API key and it is not already available, ask the user to provide/run it rather than fabricating one.

## CLI quick reference

Install/update the CLI:

```bash
curl -fsSL https://cli.static.frametap.io/install | bash
```

Enroll and verify a runner:

```bash
frametap up --token ft_enrollment_xxxxxxxxxxxxxxxxx
frametap status
frametap displays
```

Capture from the runner machine:

```bash
# Fixed-duration recording
frametap recording start --display :0 --duration 30 --name "Checkout smoke test"

# Manual/interrupt recording
frametap recording start --name "Manual repro"
frametap recording stop

# Screenshot
frametap screenshot --display :0 --name "Dashboard state"
```

Watch a folder for artifact uploads:

```bash
frametap watch start --dir /app/output --exclude "*.tmp" --exclude "*.log"
frametap watch status
frametap watch stop
```

Stop or reset local runner state:

```bash
frametap down      # stop daemon, keep credentials
frametap logout    # stop daemon and clear stored runner credentials
```

## API quick reference

Base URL: `https://api.frametap.io`

Use bearer auth and include the organization ID query parameter:

```bash
export FRAMETAP_API_KEY=ft_api_xxxxxxxxxxxxxxxxx
export FRAMETAP_ORG_ID=123
export RUNNER_ID=123

curl -X POST "https://api.frametap.io/v1/jobs?organizationId=$FRAMETAP_ORG_ID" \
  -H "Authorization: Bearer $FRAMETAP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "runnerId": '"$RUNNER_ID"',
    "displayId": "0",
    "type": "recording",
    "stopCondition": "duration",
    "stopConditionConfig": {"durationSeconds": 60}
  }'
```

For exact endpoint shapes, fetch or inspect the OpenAPI spec before writing integration code:

```bash
curl https://api-reference.frametap.io/openapi.json > frametap-openapi.json
```

## Choosing the right workflow

- Use the **app** for manual setup, runner inspection, one-off jobs, stopping running jobs, and reviewing artifacts.
- Use the **CLI** when already on the runner machine or configuring watch folders/auto-record mode.
- Use the **API** for CI, automation, scheduling, and external integrations.
- Use **Docker/Selenium** when browser automation runs inside containers and you need video evidence of the session.

## Common troubleshooting checks

- `frametap status` — confirm daemon and runner state.
- `frametap displays` — confirm available display IDs before recording/screenshotting.
- If enrollment fails, check that the `ft_enrollment_...` token is valid and unexpired.
- If capture fails, check `ffmpeg` availability or `FRAMETAP_FFMPEG_PATH`.
- If the CLI cannot connect to the daemon, try `frametap daemon start` and inspect runner logs.
- Watch-folder paths must be absolute, readable, and not symlinked.


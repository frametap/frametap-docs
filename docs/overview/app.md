# Using the Frametap App

The Frametap web app lives at [frametap.io/app](https://frametap.io/app). It is the easiest way to enroll runners, create jobs, review captures, manage keys, and monitor billing.

## Main Areas

### Dashboard

Open [frametap.io/app](https://frametap.io/app) to see:

- runner health and readiness
- current credit state
- recent recordings and screenshots
- recent jobs and job activity

Use the dashboard when you want a quick health check before creating jobs or troubleshooting a runner.

### Runners

Use [Runners](https://frametap.io/app/runners) to connect machines and inspect runner details.

The first-run onboarding flow in the app is:

1. Create a runner enrollment key
2. Copy the install command
3. Run `frametap up --token ...` on the target machine
4. Wait for the runner to appear as ready
5. Create the first job

Once a runner is connected, the app lets you:

- inspect hostname, platform, displays, and scopes
- rename a runner
- delete a runner
- start job creation from that runner

### Jobs

Use [Jobs](https://frametap.io/app/jobs) to create and manage capture jobs.

The create-job flow in the app follows this sequence:

1. choose a runner
2. choose a job type
3. choose one-time or recurring execution
4. for recordings, choose a stop condition
5. give the job a name if needed
6. pick the display to capture

The app currently exposes screenshot and recording creation directly in the UI.

### Recordings

Use [Recordings](https://frametap.io/app/recordings) to review artifacts created by Frametap.

This page is where users:

- browse recordings and screenshots
- switch between grid and table views
- preview media
- download files
- rename titles
- delete artifacts

Although the route is called `recordings`, it is the main artifact browser for Frametap documents.

### Settings

The main settings sections are:

- [API Keys](https://frametap.io/app/settings/)
- [Billing](https://frametap.io/app/settings/billing)
- [Profile](https://frametap.io/app/settings/profile)
- [Support](https://frametap.io/app/settings/support)

In **API Keys**, users create:

- runner enrollment keys for connecting machines
- access keys for the public API

In **Billing**, users can:

- view plan and credits
- buy credits
- change plan
- open subscription management

## When to Use the App vs API

### Use the App when you want to:

- enroll a runner quickly
- create one-off jobs manually
- inspect runner status
- review artifacts visually
- manage keys and billing

### Use the API when you want to:

- trigger jobs from CI or automation
- manage runners programmatically
- retrieve documents in scripts
- build your own tooling around Frametap

Use the full API reference here:

- [api-reference.frametap.io](https://api-reference.frametap.io/)

## Suggested First Workflow

1. Open [API Keys](https://frametap.io/app/settings/)
2. Create a runner enrollment key
3. Install the CLI on your machine
4. Run `frametap up --token ...`
5. Confirm the runner appears in [Runners](https://frametap.io/app/runners)
6. Create a job in [Jobs](https://frametap.io/app/jobs)
7. Review the result in [Recordings](https://frametap.io/app/recordings)

## Related Pages

- [Quick Start](/overview/quick-start)
- [Install CLI](/installation/cli)
- [API Overview](/api/overview)
- [API Reference](https://api-reference.frametap.io/)

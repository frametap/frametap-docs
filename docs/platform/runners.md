# Runners

Runners are the machines connected to Frametap.

They are installed and managed through the Frametap CLI, and they are what actually execute jobs such as recordings, screenshots, and watch-folder uploads.

## What a Runner Does

A runner:

- connects a machine to Frametap
- exposes available displays
- executes jobs on that machine
- uploads recordings, screenshots, and files back to Frametap

In the app, you can inspect runners here:

- [frametap.io/app/runners](https://frametap.io/app/runners)

## Runner Status

The main runner states you will see are:

- `offline`
- `ready`
- `working`

## How to Set Up a Runner

The normal flow is:

1. Create a runner enrollment key in [Settings → API Keys](https://frametap.io/app/settings/)
2. Install the Frametap CLI on the target machine
3. Run `frametap up --token ...`
4. Confirm the runner appears in [Runners](https://frametap.io/app/runners)

For the full setup flow, use these pages:

- [Install CLI](/installation/cli)
- [CLI Commands](/cli/commands)
- [Using the App](/overview/app)

## Capabilities

Depending on its enrollment key, a runner can be allowed to:

- capture recordings
- capture screenshots
- upload files from watch folders

## Related Pages

- [Install CLI](/installation/cli)
- [CLI Commands](/cli/commands)
- [Watch Folder](/jobs/watch-folder)
- [Job Types](/jobs/types)

# Installing the Frametap CLI

The Frametap CLI installs the runner that connects a machine to Frametap. It includes the `frametap` command-line tool and the `frametapd` daemon that stays connected and executes jobs.

::: tip Using an LLM or coding agent?
Load the [Frametap Agent Skill](/llms/skill) or the raw [`skill/SKILL.md`](https://github.com/frametap/frametap-docs/blob/main/skill/SKILL.md) file so your agent has the current runner, CLI, API, and troubleshooting workflow.
:::

## Quick Install

### macOS and Linux

```bash
curl -fsSL https://cli.static.frametap.io/install | bash
```

## Docker Image

```bash
docker pull frametap/frametap:latest
```

Read more on Docker Hub: [frametap/frametap](https://hub.docker.com/r/frametap/frametap)

## First Steps

### 1. Get an Enrollment Token

1. Log in to [frametap.io](https://frametap.io)
2. Go to [Settings → API Keys](https://frametap.io/app/settings/)
3. Create or copy a **Runner Enrollment Key**
4. The token looks like: `ft_enrollment_xxxxxxxxxxxxxxxxx`

### 2. Enroll Your Runner

```bash
frametap up --token ft_enrollment_xxxxxxxxxxxxxxxxx
```

Options:
- `--hostname <name>` - Custom runner name (default: OS hostname)
- `--watch <path>` - Set up watch folder at enrollment time
- `--yes` - Only used with `--watch`; accepts watch-folder warnings, such as prompts about uploading many existing files

### 3. Verify Installation

```bash
# Check daemon status
frametap status

# List available displays
frametap displays
```

After enrollment, the runner should appear in [Runners](https://frametap.io/app/runners).

## Directory Structure

The runner stores its local state in:

- Linux: `~/.config/frametap/`
- macOS: `~/Library/Application Support/frametap/`

Key files:
- `runner.json` - Runner registration data (token, runnerId)
- `daemon.sock` - Local CLI-to-daemon socket
- `frametapd.log` - Daemon log output
- `watch-checksums.json` - Watch-folder deduplication database

## Updating

Re-run the install command:

```bash
curl -fsSL https://cli.static.frametap.io/install | bash
```

The installer will replace the existing binary.

## Uninstalling

```bash
# Stop the daemon
frametap down

# Or stop and clear runner credentials
frametap logout

# Remove binaries
rm /usr/local/bin/frametap
rm /usr/local/bin/frametapd

# Remove data (optional)
rm -rf ~/.config/frametap
```

## Troubleshooting

### "Invalid or expired token"
- Check that your enrollment token is correct
- Tokens expire after a certain period; generate a new one in the dashboard

### "ffmpeg not found"
- Install ffmpeg: `brew install ffmpeg` (macOS) or `apt install ffmpeg` (Ubuntu)
- Or set `FRAMETAP_FFMPEG_PATH` to the binary location

### "Cannot connect to daemon"
- Check if daemon is running: `frametap status`
- Start manually: `frametap daemon start`
- Check logs in `~/.config/frametap/frametapd.log`

### Permission Denied (watch folder)
- The watch folder path must be absolute
- No symlinks in the path
- User must have read permissions

## Next Steps

- [Docker setup](/installation/docker)
- [CLI commands](/cli/commands)
- [Environment variables](/cli/environment)
- [Frametap Agent Skill](/llms/skill)

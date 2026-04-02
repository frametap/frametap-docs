# CLI Commands Reference

The Frametap CLI is how you install, enroll, inspect, and manage a Frametap runner locally.

## Overview

```
frametap [command] [flags]
```

## Global Commands

### `frametap status`

Show daemon status, version, runner info, and platform details.

```bash
frametap status
```

Output:
```
Version:     1.0.0
Uptime:      2h 15m
Runner:      runner-abc123 (online)
Platform:    linux/amd64
Hostname:    my-server
Watch Dir:   /app/output
```

### `frametap up`

Enroll a runner and start the daemon.

```bash
frametap up --token <token> [flags]
```

**Flags:**
- `--token <token>` - Enrollment token (or use `FRAMETAP_TOKEN`)
- `--hostname <name>` - Custom runner name (default: OS hostname)
- `--watch <path>` - Absolute path to watch folder
- `--yes` - Skip confirmation prompts

**Examples:**
```bash
# Basic enrollment
frametap up --token ft_enrollment_xxxxxxxx

# With custom name and watch folder
frametap up --token ft_enrollment_xxxxxxxx \
  --hostname "ci-runner-1" \
  --watch /app/screenshots \
  --yes
```

**Behavior:**
- Validates the token immediately
- Exits with error if token is invalid or expired
- Starts `frametapd` in the background if not already running
- Idempotent: safe to run multiple times with same token

### `frametap down`

Stop the daemon while preserving runner credentials.

```bash
frametap down
```

**Behavior:**
- Stops daemon process
- Keeps the stored runner so `frametap up` can reconnect later

### `frametap logout`

Stop the daemon and clear stored runner credentials.

```bash
frametap logout
```

## Display Commands

### `frametap displays`

List available displays.

```bash
frametap displays
```

Output:
```
Display ID    Resolution    Primary
:0            1920x1080     *
:1            1280x720
```

Use the Display ID when creating jobs in [Jobs](https://frametap.io/app/jobs) or through the API.

## Watch Folder Commands

### `frametap watch start`

Start monitoring a directory for file uploads.

```bash
frametap watch start --dir <path> [flags]
```

**Flags:**
- `--dir <path>` - Absolute path to watch (required)
- `--exclude <glob>` - Exclude pattern (repeatable)
- `--yes` - Skip confirmation

**Example:**
```bash
frametap watch start \
  --dir /app/output \
  --exclude "*.log" \
  --exclude "*.tmp"
```

**Requirements:**
- Path must be absolute (e.g., `/home/user/files`)
- No symlinks in path
- User must have read permissions

### `frametap watch stop`

Stop watching directory.

```bash
frametap watch stop
```

### `frametap watch status`

Show watch configuration.

```bash
frametap watch status
```

Output:
```
Watching:    true
Directory:   /app/output
Exclusions:  *.log, *.tmp
```

## Daemon Commands

### `frametap daemon start`

Start daemon in foreground (for debugging).

```bash
frametap daemon start
```

### `frametap daemon socket`

Print daemon socket path.

```bash
frametap daemon socket
```

Output:
```
~/.config/frametap/daemon.sock
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Invalid arguments |
| 3 | Daemon not running |
| 4 | Invalid/expired token |
| 5 | Permission denied |
| 6 | File not found |
| 7 | Network error |

## Related Pages

- [Install CLI](/installation/cli)
- [Environment Variables](/cli/environment)
- [Using the App](/overview/app)

## Tips

### Shell Completion

```bash
# Bash
source <(frametap completion bash)

# Zsh
source <(frametap completion zsh)

# Fish
frametap completion fish | source
```

### Alias for Common Commands

```bash
# Add to .bashrc or .zshrc
alias ft='frametap'
alias ft-up='frametap up --token $FRAMETAP_TOKEN'
alias ft-status='frametap status'
```

### Watch Multiple Directories

While you can only watch one directory per runner, you can run multiple runners:

```bash
# Runner 1 - screenshots
FRAMETAP_HOSTNAME=runner-1 frametap up --watch /app/screenshots

# Runner 2 - logs
FRAMETAP_HOSTNAME=runner-2 frametap up --watch /app/logs
```

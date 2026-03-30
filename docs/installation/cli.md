# Installing the Frametap CLI

The Frametap CLI (`frametap`) is a Go-based tool that runs on your machines to capture screens and communicate with the Frametap platform.

## Quick Install

### macOS and Linux

```bash
curl -fsSL https://cli.frametap.io/install | bash
```

## Manual Installation

### From Source

**Requirements:**
- Go 1.25+
- ffmpeg and ffprobe on PATH
- Linux: `wmctrl` for window listing

**Build:**
```bash
git clone https://github.com/frametap/cli.git
cd cli
mkdir -p dist
go build -o dist/frametap ./cmd/cli
go build -o dist/frametapd ./cmd/daemon
```

**Install:**
```bash
# Move to PATH
sudo mv dist/frametap /usr/local/bin/
sudo mv dist/frametapd /usr/local/bin/
```

### Docker Image

```bash
docker pull frametap/frametap-cli:latest
```

## First Steps

### 1. Get an Enrollment Token

1. Log in to [frametap.io](https://frametap.io)
2. Go to [Settings → API Keys](https://frametap.io/app/settings/)
3. Create an enrollment key or copy an existing one
4. The token looks like: `ft_enrollment_xxxxxxxxxxxxxxxxx`

### 2. Enroll Your Runner

```bash
frametap up --token ft_enrollment_xxxxxxxxxxxxxxxxx
```

Options:
- `--hostname <name>` - Custom runner name (default: OS hostname)
- `--watch <path>` - Set up watch folder at enrollment time
- `--yes` - Skip confirmations

### 3. Verify Installation

```bash
# Check daemon status
frametap status

# List available displays
frametap screens

# List windows (Linux only, requires wmctrl)
frametap windows
```

## Directory Structure

The CLI stores data in:

- **Config**: `~/.config/frametap/` (Linux) or `~/Library/Application Support/frametap/` (macOS)
- **Data**: `~/.local/share/frametap/` (Linux) or `~/Library/Application Support/frametap/` (macOS)

Key files:
- `runner.json` - Runner registration data (token, runnerId)
- `watcher.json` - Watch folder configuration
- `checksums.json` - Checksum database for deduplication

## Updating

Re-run the install command:

```bash
curl -fsSL https://cli.frametap.io/install | bash
```

The installer will replace the existing binary.

## Uninstalling

```bash
# Stop and unenroll
frametap down

# Remove binaries
rm /usr/local/bin/frametap
rm /usr/local/bin/frametapd

# Remove data (optional)
rm -rf ~/.config/frametap
rm -rf ~/.local/share/frametap
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
- Check logs in `~/.local/share/frametap/daemon.log`

### Permission Denied (watch folder)
- The watch folder path must be absolute
- No symlinks in the path
- User must have read permissions

## Next Steps

- [Docker setup](/installation/docker)
- [CLI commands](/cli/commands)
- [Environment variables](/cli/environment)

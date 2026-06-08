# Frametap Agent Skill

Frametap provides an Agent Skill for LLM coding agents that need to use or explain Frametap workflows.

- Skill source: [`skill/SKILL.md`](https://github.com/frametap/frametap-docs/blob/main/skill/SKILL.md)
- Raw download URL: `https://raw.githubusercontent.com/frametap/frametap-docs/main/skill/SKILL.md`
- Skill name: `frametap`

Use it when an agent needs help with:

- Frametap runner setup and enrollment
- CLI commands for screenshots, recordings, and watch-folder uploads
- API workflows for creating jobs and retrieving artifacts
- Selenium/CI recording setup
- Frametap docs contributions

After installing a skill, start a new agent session so the tool can rediscover available skills.

## Install in pi

Pi can discover standalone Markdown skill files in `~/.pi/agent/skills/`.

```bash
mkdir -p ~/.pi/agent/skills
curl -L "https://raw.githubusercontent.com/frametap/frametap-docs/main/skill/SKILL.md" \
  -o ~/.pi/agent/skills/frametap.md
```

If you are already inside this repository, you can also point pi at the skill folder directly:

```bash
pi --skill ./skill
```

## Install in Claude Code

Claude Code discovers skills from `.claude/skills/<name>/SKILL.md` in a project, or `~/.claude/skills/<name>/SKILL.md` globally.

Global install:

```bash
mkdir -p ~/.claude/skills/frametap
curl -L "https://raw.githubusercontent.com/frametap/frametap-docs/main/skill/SKILL.md" \
  -o ~/.claude/skills/frametap/SKILL.md
```

Project install:

```bash
mkdir -p .claude/skills/frametap
curl -L "https://raw.githubusercontent.com/frametap/frametap-docs/main/skill/SKILL.md" \
  -o .claude/skills/frametap/SKILL.md
```

## Install in Codex

Codex discovers skills from `~/.codex/skills/<name>/SKILL.md` globally, or `.codex/skills/<name>/SKILL.md` in a project.

Global install:

```bash
mkdir -p ~/.codex/skills/frametap
curl -L "https://raw.githubusercontent.com/frametap/frametap-docs/main/skill/SKILL.md" \
  -o ~/.codex/skills/frametap/SKILL.md
```

Project install:

```bash
mkdir -p .codex/skills/frametap
curl -L "https://raw.githubusercontent.com/frametap/frametap-docs/main/skill/SKILL.md" \
  -o .codex/skills/frametap/SKILL.md
```

## Install in OpenCode

OpenCode discovers skills from `~/.config/opencode/skills/<name>/SKILL.md` globally, or `.opencode/skills/<name>/SKILL.md` in a project.

Global install:

```bash
mkdir -p ~/.config/opencode/skills/frametap
curl -L "https://raw.githubusercontent.com/frametap/frametap-docs/main/skill/SKILL.md" \
  -o ~/.config/opencode/skills/frametap/SKILL.md
```

Project install:

```bash
mkdir -p .opencode/skills/frametap
curl -L "https://raw.githubusercontent.com/frametap/frametap-docs/main/skill/SKILL.md" \
  -o .opencode/skills/frametap/SKILL.md
```

## Notes

Most Agent Skills-compatible tools load the folder containing `SKILL.md`. Pi also supports standalone `.md` skill files in its global skills directory, which is why the pi example downloads to `frametap.md`.

Review the skill before enabling it. Skills are instructions that an agent may follow while using local tools.

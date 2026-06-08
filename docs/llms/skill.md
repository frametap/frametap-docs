# Frametap Agent Skill

Frametap provides an Agent Skill for LLM coding agents that need to use or explain Frametap workflows.

- Skill file: [`skill/SKILL.md`](https://github.com/frametap/frametap-docs/blob/main/skill/SKILL.md)
- Skill name: `frametap`

Use it when an agent needs help with:

- Frametap runner setup and enrollment
- CLI commands for screenshots, recordings, and watch-folder uploads
- API workflows for creating jobs and retrieving artifacts
- Selenium/CI recording setup
- Frametap docs contributions

## Install in pi

Point pi at the skill file directly:

```bash
pi --skill ./skill
```

Or copy/symlink it into a global skills directory:

```bash
mkdir -p ~/.pi/agent/skills
ln -s /path/to/frametap-docs/skill ~/.pi/agent/skills/frametap
```

## Install in other Agent Skills-compatible tools

Most tools that support the Agent Skills standard can load the folder containing `SKILL.md`:

```text
frametap-docs/skill/SKILL.md
```

Review the skill before enabling it. Skills are instructions that an agent may follow while using local tools.

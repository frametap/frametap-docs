# Projects

Projects help organize your jobs, recordings, screenshots, and files.

## Overview

Projects are the primary way to group related work:
- Organize test recordings by feature or team
- Separate staging from production captures
- Manage access and billing per project

## Creating Projects

### Via Dashboard

1. Go to [frametap.io](https://frametap.io)
2. Click "New Project"
3. Enter name and description
4. Save

### Via API

```bash
curl -X POST https://api.frametap.io/v1/projects \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "E2E Tests",
    "description": "End-to-end test recordings for checkout flow"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 456,
    "name": "E2E Tests",
    "slug": "e2e-tests",
    "description": "End-to-end test recordings for checkout flow",
    "createdAt": "2026-03-28T10:00:00Z"
  }
}
```

## Project Slugs

Each project gets a unique URL-friendly slug:
- Auto-generated from name: "E2E Tests" → `e2e-tests`
- Used in URLs: `https://frametap.io/projects/e2e-tests`

## Using Projects

### Assign Jobs to Projects

```bash
curl -X POST https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "runnerId": 123,
    "type": "recording",
    "projectId": 456
  }'
```

### Auto-Assign with CLI

```bash
export FRAMETAP_TOKEN=ft_enrollment_xxx
export FRAMETAP_AUTO_RECORD=true
frametap up
# Jobs are automatically assigned to your default project
```

## Managing Projects

### List Projects

```bash
curl https://api.frametap.io/v1/projects \
  -H "Authorization: Bearer $API_KEY"
```

### Update Project

```bash
curl -X PATCH https://api.frametap.io/v1/projects/456 \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"name": "Updated Name", "description": "New description"}'
```

### Delete Project

::: warning
Deleting a project removes all associated jobs and documents.
:::

```bash
curl -X DELETE https://api.frametap.io/v1/projects/456 \
  -H "Authorization: Bearer $API_KEY"
```

## Filtering by Project

### Jobs

```bash
curl "https://api.frametap.io/v1/jobs?projectId=456" \
  -H "Authorization: Bearer $API_KEY"
```

### Documents

```bash
curl "https://api.frametap.io/v1/documents?projectId=456" \
  -H "Authorization: Bearer $API_KEY"
```

## Best Practices

### 1. Organize by Purpose

```
├── production-monitoring
├── staging-tests
├── ci-cd-artifacts
└── development-debugging
```

### 2. Use Descriptive Names

```bash
# Good
curl -X POST /v1/projects -d '{"name": "Checkout Flow E2E Tests"}'

# Bad
curl -X POST /v1/projects -d '{"name": "Project 1"}'
```

### 3. Clean Up Regularly

Delete old projects to manage storage costs:

```bash
# List old projects
curl "https://api.frametap.io/v1/projects?sortField=createdAt&sortType=asc" \
  -H "Authorization: Bearer $API_KEY"
```

### 4. CI/CD Integration

Create a project per branch:

```yaml
# GitHub Actions
- name: Create project
  run: |
    PROJECT=$(curl -X POST https://api.frametap.io/v1/projects \
      -H "Authorization: Bearer $API_KEY" \
      -d "{\"name\": \"Branch: ${GITHUB_REF_NAME}\"}" \
      | jq -r '.data.id')
    echo "FRAMETAP_PROJECT_ID=$PROJECT" >> $GITHUB_ENV
```

## Project Limits

| Plan | Projects |
|------|----------|
| Free | 3 |
| Dev | 10 |
| Pro | Unlimited |

## Troubleshooting

### Cannot create project
- Check project limit for your plan
- Verify API key has `projects:update` scope

### Project not showing
- Check you're using the correct organization
- Verify project hasn't been deleted

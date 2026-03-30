# Authentication

Frametap uses multiple authentication methods for different use cases.

## Authentication Methods

### 1. API Keys (Recommended for Automation)

For programmatic access from scripts, CI/CD pipelines, and integrations.

**Format:**
```
ft_api_xxxxxxxxxxxxxxxxxxxxxx
```

**Usage:**
```bash
curl https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer ft_api_xxxxxxxxxxxxxxxxx"
```

### 2. Enrollment Tokens

For registering CLI runners.

**Format:**
```
ft_enrollment_xxxxxxxxxxxxxxxxxxxxxx
```

**Usage:**
```bash
frametap up --token ft_enrollment_xxxxxxxxxxxxxxxxx
```

### 3. Session Authentication

For web dashboard access via WorkOS.

## Creating API Keys

### Via Dashboard

1. Log in to [frametap.io](https://frametap.io)
2. Go to [Settings → API Keys](https://frametap.io/app/settings/)
3. Click "Create API Key"
4. Set name, scopes, and expiration
5. Copy the key (shown once only)

### Via API

```bash
curl -X POST https://api.frametap.io/v1/keys \
  -H "Authorization: Bearer $EXISTING_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CI/CD Pipeline",
    "scopes": ["jobs:create", "jobs:read", "runners:read"],
    "expiresAt": "2026-12-31T23:59:59Z"
  }'
```

### Scopes

Control what each key can access:

| Scope | Description |
|-------|-------------|
| `jobs:create` | Create new jobs |
| `jobs:read` | List and view jobs |
| `jobs:update` | Update/cancel jobs |
| `jobs:delete` | Delete jobs |
| `runners:read` | List and view runners |
| `runners:update` | Update runners |
| `documents:read` | List and view documents |
| `documents:delete` | Delete documents |
| `projects:read` | List and view projects |
| `projects:update` | Create/update projects |
| `billing:read` | View billing info |

### Key Types

**API Key:**
- Used for API calls
- Can have granular scopes
- Can set expiration
- Revocable

**Enrollment Key:**
- Used to register runners
- Scoped to specific capabilities
- Can include watch folder paths
- Tied to organization/project

## Using API Keys

### cURL

```bash
export API_KEY="ft_api_xxxxxxxxxxxxxxxxx"

# List jobs
curl https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY"

# Create job
curl -X POST https://api.frametap.io/v1/jobs \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "runnerId": 123,
    "type": "recording",
    "stopCondition": "duration",
    "stopConditionConfig": {"durationSeconds": 60}
  }'
```

### Python

```python
import requests
import os

API_KEY = os.environ['FRAMETAP_API_KEY']
HEADERS = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# List jobs
response = requests.get(
    'https://api.frametap.io/v1/jobs',
    headers=HEADERS
)
jobs = response.json()

# Create job
response = requests.post(
    'https://api.frametap.io/v1/jobs',
    headers=HEADERS,
    json={
        'runnerId': 123,
        'type': 'screenshot',
        'displayId': ':0'
    }
)
job = response.json()
```

### JavaScript

```javascript
const API_KEY = process.env.FRAMETAP_API_KEY;
const HEADERS = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

// List jobs
const jobs = await fetch('https://api.frametap.io/v1/jobs', {
  headers: HEADERS
}).then(r => r.json());

// Create job
const job = await fetch('https://api.frametap.io/v1/jobs', {
  method: 'POST',
  headers: HEADERS,
  body: JSON.stringify({
    runnerId: 123,
    type: 'recording',
    stopCondition: 'duration',
    stopConditionConfig: { durationSeconds: 60 }
  })
}).then(r => r.json());
```

## Managing Keys

### List Keys

```bash
curl https://api.frametap.io/v1/keys \
  -H "Authorization: Bearer $API_KEY"
```

### Revoke Key

```bash
curl -X DELETE https://api.frametap.io/v1/keys/456 \
  -H "Authorization: Bearer $API_KEY"
```

### Rotate Keys

Best practice for key rotation:

```bash
# 1. Create new key
curl -X POST https://api.frametap.io/v1/keys \
  -H "Authorization: Bearer $OLD_KEY" \
  -d '{"name": "New Production Key", "scopes": ["jobs:*"]}'

# 2. Update your applications to use new key
# 3. Test with new key
# 4. Revoke old key
curl -X DELETE https://api.frametap.io/v1/keys/$OLD_KEY_ID \
  -H "Authorization: Bearer $NEW_KEY"
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Test with Frametap
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Create recording job
        env:
          FRAMETAP_API_KEY: ${{ secrets.FRAMETAP_API_KEY }}
        run: |
          curl -X POST https://api.frametap.io/v1/jobs \
            -H "Authorization: Bearer $FRAMETAP_API_KEY" \
            -d '{"runnerId": 123, "type": "recording", ...}'
```

### GitLab CI

```yaml
variables:
  FRAMETAP_API_KEY: $FRAMETAP_API_KEY

job:
  script:
    - |
      curl -X POST https://api.frametap.io/v1/jobs \
        -H "Authorization: Bearer $FRAMETAP_API_KEY" \
        -d '{"runnerId": 123, "type": "recording", ...}'
```

### Docker Secrets

```yaml
services:
  app:
    image: my-app
    secrets:
      - frametap_api_key
    environment:
      - FRAMETAP_API_KEY_FILE=/run/secrets/frametap_api_key

secrets:
  frametap_api_key:
    file: ./secrets/api_key.txt
```

## Security Best Practices

### 1. Use Environment Variables

Never hardcode keys in source code:

```python
# ❌ Bad
API_KEY = "ft_api_abc123..."

# ✅ Good
import os
API_KEY = os.environ['FRAMETAP_API_KEY']
```

### 2. Limit Scopes

Grant only necessary permissions:

```json
{
  "name": "Read-only Monitor",
  "scopes": ["jobs:read", "documents:read"]
}
```

### 3. Set Expiration

Rotate keys regularly:

```json
{
  "name": "Production Key",
  "scopes": ["jobs:*"],
  "expiresAt": "2026-12-31"
}
```

### 4. Use Different Keys for Different Environments

```bash
# Production
FRAMETAP_API_KEY=ft_api_prod_xxx

# Development
FRAMETAP_API_KEY=ft_api_dev_xxx
```

### 5. Secure Storage

- Use secret managers (1Password, AWS Secrets Manager, etc.)
- Never commit keys to version control
- Use `.env` files (add to `.gitignore`)

## Troubleshooting

### "Invalid API key"

- Check the key is complete (starts with `ft_api_`)
- Verify no extra spaces or newlines
- Ensure key hasn't been revoked

### "Insufficient permissions"

- Check key scopes in dashboard
- Request additional scopes if needed
- Use a key with broader permissions for testing

### "Key expired"

- Check expiration date in dashboard
- Create a new key
- Update your applications

## WebSocket Authentication

WebSocket connections use the runner token:

```javascript
const ws = new WebSocket(
  'wss://api.frametap.io/v1/ws/runners',
  [],
  {
    headers: {
      'Authorization': 'Bearer ' + RUNNER_TOKEN
    }
  }
);
```

The runner token is obtained during enrollment and stored locally by the CLI.

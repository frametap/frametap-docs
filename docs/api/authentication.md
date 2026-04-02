# Authentication

Frametap uses different credentials depending on whether you are automating the API, enrolling a runner, or signing into the dashboard.

## Authentication Methods

### API Keys

Use API keys for scripts, CI pipelines, agents, and integrations.

**Format**

```
ft_api_xxxxxxxxxxxxxxxxxxxxxx
```

**Usage**

```bash
curl "https://api.frametap.io/v1/jobs?organizationId=123" \
  -H "Authorization: Bearer ft_api_xxxxxxxxxxxxxxxxx"
```

### Enrollment Tokens

Use enrollment tokens to register the Frametap runner on a machine.

**Format**

```
ft_enrollment_xxxxxxxxxxxxxxxxxxxxxx
```

**Usage**

```bash
frametap up --token ft_enrollment_xxxxxxxxxxxxxxxxx
```

### Dashboard Session Authentication

The web app uses your normal Frametap sign-in session.

## Creating API Keys

Create API keys in the dashboard:

1. Log in to [frametap.io](https://frametap.io)
2. Go to [Settings → API Keys](https://frametap.io/app/settings/)
3. Switch to **Access Keys**
4. Click **Create API Key**
5. Set the name, scopes, and expiration
6. Copy the key when it is shown

## Scopes

Choose the minimum scopes your automation needs.

## Using API Keys

### cURL

```bash
export FRAMETAP_API_KEY="ft_api_xxxxxxxxxxxxxxxxx"
export FRAMETAP_ORG_ID="123"

# List jobs
curl "https://api.frametap.io/v1/jobs?organizationId=$FRAMETAP_ORG_ID" \
  -H "Authorization: Bearer $FRAMETAP_API_KEY"

# Create a recording job
curl -X POST "https://api.frametap.io/v1/jobs?organizationId=$FRAMETAP_ORG_ID" \
  -H "Authorization: Bearer $FRAMETAP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "runnerId": 123,
    "displayId": "0",
    "type": "recording",
    "stopCondition": "duration",
    "stopConditionConfig": {"durationSeconds": 60}
  }'
```

## API Reference

For current request formats, scopes, and endpoint details:

- [API keys endpoints](https://api-reference.frametap.io/#tag/api-keys)
- [OpenAPI Spec](https://api-reference.frametap.io/openapi.json)

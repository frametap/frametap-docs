# API Reference

Complete interactive API documentation powered by Scalar.

## Interactive Documentation

Visit our interactive API explorer:

**[📚 Open API Reference](https://frametap.io/api)**

Features:
- Interactive request builder
- Code examples in multiple languages
- Request/response schemas
- Authentication testing
- Try-it-now functionality

## OpenAPI Specification

Download the raw OpenAPI spec:

```bash
curl -o frametap-openapi.json https://api.frametap.io/openapi.json
```

## Using the API Reference

### 1. Select Endpoint

Browse available endpoints in the left sidebar:
- Runners
- Jobs
- Documents
- Projects
- API Keys
- Billing

### 2. View Schema

Each endpoint shows:
- Request parameters
- Request body schema
- Response codes
- Response body schema

### 3. Try It

Test API calls directly:

1. Enter your API key
2. Fill in required parameters
3. Click "Send Request"
4. View the response

### 4. Copy Code

Get code examples in your preferred language:
- cURL
- Python (requests)
- JavaScript (fetch)
- Go
- Ruby
- PHP

## API Status

Check API health and status:

```bash
curl https://api.frametap.io/health
```

For status updates and incidents:
- [status.frametap.io](https://status.frametap.io)
- Subscribe to status page for alerts

## API Versions

Current version: **v1**

Versioning is URL-based:
```
https://api.frametap.io/v1/...
```

Breaking changes will be announced 30 days in advance with migration guides.

## SDK Generation

Generate client SDKs from the OpenAPI spec:

### Using OpenAPI Generator

```bash
# Install
docker pull openapitools/openapi-generator-cli

# Generate Python SDK
docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
  -i https://api.frametap.io/openapi.json \
  -g python \
  -o /local/frametap-python

# Generate TypeScript SDK
docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
  -i https://api.frametap.io/openapi.json \
  -g typescript-axios \
  -o /local/frametap-typescript
```

### Using Postman

Import the OpenAPI spec into Postman:

1. Open Postman
2. Click Import → Link
3. Enter: `https://api.frametap.io/openapi.json`
4. Import as Collection

## Postman Collection

Download our official Postman collection:

```bash
curl -o Frametap.postman_collection.json \
  https://frametap.io/docs/postman-collection.json
```

## API Changelog

### v1.0.0 (2026-03-01)

Initial release with:
- Runner management
- Job types: recording, screenshot, file upload, stream
- Stop conditions: duration, interrupt, selenium_idle
- Document storage and retrieval
- Watch folder uploads
- Credit-based billing

## Feedback

Found an issue with the API or documentation?

- Report at [github.com/frametap/docs](https://github.com/frametap/docs)
- Email: hello@frametap.io

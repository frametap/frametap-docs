# API Overview

The Frametap API lets you create jobs, manage runners, and retrieve captured artifacts from your own automation.

## Base URL

```
https://api.frametap.io
```

## API Reference

For the full endpoint list, request and response schemas, and interactive examples, use the external API reference:

👉 **[Open the API Reference](https://api-reference.frametap.io/)**

## How customers typically use the API

1. Install the Frametap runner on the target machine
2. Enroll the machine with an enrollment token
3. Create jobs through the app or API
4. Review recordings, screenshots, and uploaded files in Frametap

If you want the UI workflow first, start in the app:

- [frametap.io/app](https://frametap.io/app)

## Authentication

For automation, authenticate with an API key in the `Authorization` header.

See [Authentication](/api/authentication) for setup details.

## Core Resources

### Runners
Runners are the enrolled machines that receive jobs and upload results.

### Jobs
Jobs tell a runner what to do. The main API-created job types are `recording` and `screenshot`. Frametap also has `file_upload`, which is typically triggered by runner watch-folder configuration rather than manually created like a recording or screenshot.

### Documents
Documents are the artifacts created by jobs, including recordings, screenshots, and uploaded files.

## Common API Workflows

Use the API reference for exact request formats, but the most common automation flows are:

- create recording jobs
- create screenshot jobs
- list and inspect documents
- cancel running jobs
- manage runners

## OpenAPI Specification

Download the raw OpenAPI spec:

```bash
curl https://api-reference.frametap.io/openapi.json > frametap-openapi.json
```

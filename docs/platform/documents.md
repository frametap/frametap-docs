# Documents

Documents are the artifacts produced by Frametap jobs, including recordings, screenshots, and files uploaded from watch folders.

## Overview

When a job completes successfully, Frametap creates a document for the resulting artifact. Documents are the main thing users browse and download from the [Recordings page](https://frametap.io/app/recordings).

## Where Documents Appear

The main place to work with documents is [frametap.io/app/recordings](https://frametap.io/app/recordings), which is the main artifact browser for recordings, screenshots, and uploaded files.

## Common Document Types

The most common document types are `video`, `screenshot`, and `file_upload`.

## Downloads

You can download documents directly from the [Recordings page](https://frametap.io/app/recordings). If you need a signed download link for automation or another system, use the document file `/url` endpoint in the API reference:

- [Documents endpoints](https://api-reference.frametap.io/#tag/documents)
- [Signed file URL endpoint](https://api-reference.frametap.io/#tag/document-files/GET/v1/documents/files/{id}/url)

## Retention

Documents are stored based on your plan:

| Plan | Retention |
|------|-----------|
| Free | 7 days |
| Dev | 30 days |
| Pro | 60 days |

After the retention period, documents are automatically deleted.

## File Size Limits

| Plan | Max file size |
|------|---------------|
| Free | 100 MB |
| Dev | 5 GB |
| Pro | 15 GB |

These limits apply to individual files.

They are especially relevant for watch-folder uploads.

Your total stored usage is separate and depends on your plan credits and retention window.

## Related Pages

- [Job Types](/jobs/types)
- [Watch Folder](/jobs/watch-folder)
- [Billing](/platform/billing)
- [Documents endpoints](https://api-reference.frametap.io/#tag/documents)

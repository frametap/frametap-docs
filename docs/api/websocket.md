# WebSocket Protocol

Frametap uses WebSocket connections for real-time communication between runners and the backend, and for streaming events to clients.

## Overview

```
wss://api.frametap.io/v1/ws/runners    - Runner control
wss://api.frametap.io/v1/ws/events     - Real-time events
```

## Runner WebSocket

Runners maintain a persistent WebSocket connection to receive commands and send status updates.

### Connection

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

### Authentication

Use the runner token obtained during registration:

```
Authorization: Bearer ft_runner_xxxxxxxxxxxx
```

### Message Format

All messages are JSON:

```typescript
interface WebSocketMessage {
  type: string;
  feature?: string;
  message?: string;
  payload?: any;
}
```

### Runner → Backend Messages

#### Status Update

```json
{
  "type": "status",
  "payload": {
    "runnerId": 123,
    "status": "ready",
    "displays": [
      {
        "id": ":0",
        "name": "Display 1",
        "width": 1920,
        "height": 1080
      }
    ],
    "version": "1.0.0",
    "platform": "linux/amd64"
  }
}
```

#### Job Event

```json
{
  "type": "event",
  "feature": "recording",
  "message": "recording_started",
  "payload": {
    "jobId": 789,
    "displayId": ":0",
    "timestamp": "2026-03-28T10:00:00Z"
  }
}
```

#### Watch Folder Event

```json
{
  "type": "event",
  "feature": "watch",
  "message": "file_appeared",
  "payload": {
    "path": "/app/output/screenshot.png",
    "checksum": "abc123...",
    "size": 1024567,
    "fileType": "image",
    "contentType": "image/png",
    "metadata": {
      "width": 1920,
      "height": 1080
    },
    "detectedAt": "2026-03-28T10:00:00Z"
  }
}
```

#### Result

```json
{
  "type": "result",
  "payload": {
    "jobId": 789,
    "success": true,
    "data": {
      "size": 12345678,
      "duration": 60,
      "checksum": "xyz789..."
    }
  }
}
```

### Backend → Runner Messages

#### Command: Record

```json
{
  "type": "command",
  "feature": "recording",
  "message": "record",
  "payload": {
    "jobId": 789,
    "displayId": ":0",
    "stopCondition": "duration",
    "stopConditionConfig": {
      "durationSeconds": 60
    }
  }
}
```

#### Command: Screenshot

```json
{
  "type": "command",
  "feature": "screenshot",
  "message": "screenshot",
  "payload": {
    "jobId": 790,
    "displayId": ":0"
  }
}

```

#### Command: Stream

```json
{
  "type": "command",
  "feature": "stream",
  "message": "stream",
  "payload": {
    "jobId": 791,
    "displayId": ":0",
    "record": true
  }
}
```

#### Command: Thumbnail

```json
{
  "type": "command",
  "feature": "thumbnail",
  "message": "thumbnail",
  "payload": {
    "jobId": 792,
    "displayId": ":0",
    "time": 30
  }
}
```

#### Command: Cancel

```json
{
  "type": "command",
  "feature": "job",
  "message": "cancel",
  "payload": {
    "jobId": 789
  }
}
```

### Message Flow Example

```mermaid
sequenceDiagram
    participant B as Backend
    participant W as WebSocket
    participant R as Runner
    participant F as ffmpeg
    
    R->>W: Connect (auth)
    W->>B: Authenticate
    B->>W: OK
    W->>R: Connected
    
    B->>W: COMMAND: record
    W->>R: relay
    R->>F: Start ffmpeg
    R->>W: EVENT: recording_started
    W->>B: relay
    
    F->>R: Video complete
    R->>R: Upload to S3
    R->>W: EVENT: recording_completed
    W->>B: relay
    B->>B: Update job status
```

## Events WebSocket

Subscribe to real-time job and runner events.

### Connection

```javascript
const ws = new WebSocket(
  'wss://api.frametap.io/v1/ws/events',
  [],
  {
    headers: {
      'Authorization': 'Bearer ' + API_KEY
    }
  }
);
```

### Subscribe to Events

```json
{
  "type": "subscribe",
  "payload": {
    "jobId": 789
  }
}
```

### Event Types

#### Job Created

```json
{
  "type": "event",
  "feature": "job",
  "message": "job_created",
  "payload": {
    "jobId": 789,
    "runnerId": 123,
    "type": "recording",
    "status": "queued",
    "timestamp": "2026-03-28T10:00:00Z"
  }
}
```

#### Job Started

```json
{
  "type": "event",
  "feature": "job",
  "message": "job_started",
  "payload": {
    "jobId": 789,
    "status": "running",
    "timestamp": "2026-03-28T10:00:01Z"
  }
}
```

#### Job Completed

```json
{
  "type": "event",
  "feature": "job",
  "message": "job_completed",
  "payload": {
    "jobId": 789,
    "status": "completed",
    "documentId": 999,
    "timestamp": "2026-03-28T10:02:00Z"
  }
}
```

#### Job Failed

```json
{
  "type": "event",
  "feature": "job",
  "message": "job_failed",
  "payload": {
    "jobId": 789,
    "status": "failed",
    "error": "Display not found",
    "timestamp": "2026-03-28T10:00:05Z"
  }
}
```

#### Runner Status Change

```json
{
  "type": "event",
  "feature": "runner",
  "message": "runner_status_changed",
  "payload": {
    "runnerId": 123,
    "previousStatus": "offline",
    "currentStatus": "ready",
    "timestamp": "2026-03-28T10:00:00Z"
  }
}
```

#### Document Ready

```json
{
  "type": "event",
  "feature": "document",
  "message": "document_ready",
  "payload": {
    "documentId": 999,
    "jobId": 789,
    "type": "video",
    "url": "https://frametap.io/documents/999",
    "timestamp": "2026-03-28T10:02:00Z"
  }
}
```

## Reconnection

The runner automatically reconnects with exponential backoff:

1. Initial connection attempt
2. If fails, wait 1 second and retry
3. If fails again, wait 2 seconds
4. Continue doubling up to 60 seconds
5. Max delay: 60 seconds between attempts

## Heartbeat

Both WebSocket connections use ping/pong to keep connection alive:

- Server sends ping every 30 seconds
- Client must respond with pong within 10 seconds
- Connection closed if no pong received

## Error Handling

### Connection Errors

```javascript
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
  // Retry connection
};

ws.onclose = (event) => {
  if (event.code === 1006) {
    // Abnormal closure, retry
    reconnect();
  }
};
```

### Authentication Errors

```json
{
  "type": "error",
  "payload": {
    "code": "AUTH_FAILED",
    "message": "Invalid runner token"
  }
}
```

### Command Errors

```json
{
  "type": "error",
  "feature": "recording",
  "message": "record_failed",
  "payload": {
    "jobId": 789,
    "error": "Display :0 not found",
    "timestamp": "2026-03-28T10:00:02Z"
  }
}
```

## Code Examples

### Node.js Client

```javascript
class FrametapWebSocket {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.ws = null;
    this.reconnectDelay = 1000;
  }

  connect() {
    this.ws = new WebSocket(
      'wss://api.frametap.io/v1/ws/events',
      [],
      {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      }
    );

    this.ws.onopen = () => {
      console.log('Connected');
      this.reconnectDelay = 1000;
    };

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      this.handleMessage(msg);
    };

    this.ws.onclose = () => {
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  reconnect() {
    setTimeout(() => {
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 60000);
      this.connect();
    }, this.reconnectDelay);
  }

  handleMessage(msg) {
    switch (msg.message) {
      case 'job_completed':
        console.log(`Job ${msg.payload.jobId} completed!`);
        break;
      case 'document_ready':
        console.log(`Document ready: ${msg.payload.url}`);
        break;
    }
  }

  subscribe(jobId) {
    this.ws.send(JSON.stringify({
      type: 'subscribe',
      payload: { jobId }
    }));
  }
}

const client = new FrametapWebSocket('ft_api_xxx');
client.connect();
```

### Python Client

```python
import asyncio
import websockets
import json
import os

class FrametapWebSocket:
    def __init__(self, api_key):
        self.api_key = api_key
        self.ws = None
        self.reconnect_delay = 1
    
    async def connect(self):
        uri = 'wss://api.frametap.io/v1/ws/events'
        headers = {'Authorization': f'Bearer {self.api_key}'}
        
        while True:
            try:
                async with websockets.connect(uri, extra_headers=headers) as ws:
                    self.ws = ws
                    self.reconnect_delay = 1
                    print('Connected to WebSocket')
                    
                    async for message in ws:
                        data = json.loads(message)
                        self.handle_message(data)
                        
            except Exception as e:
                print(f'Connection error: {e}')
                await asyncio.sleep(self.reconnect_delay)
                self.reconnect_delay = min(self.reconnect_delay * 2, 60)
    
    def handle_message(self, msg):
        if msg.get('message') == 'job_completed':
            print(f"Job {msg['payload']['jobId']} completed!")
        elif msg.get('message') == 'document_ready':
            print(f"Document ready: {msg['payload']['url']}")
    
    async def subscribe(self, job_id):
        if self.ws:
            await self.ws.send(json.dumps({
                'type': 'subscribe',
                'payload': {'jobId': job_id}
            }))

# Usage
async def main():
    api_key = os.environ['FRAMETAP_API_KEY']
    client = FrametapWebSocket(api_key)
    await client.connect()

asyncio.run(main())
```

## Best Practices

1. **Always reconnect**: WebSocket connections can drop; implement reconnection logic
2. **Handle auth errors**: If auth fails, check your token and don't retry forever
3. **Subscribe selectively**: Only subscribe to events you need
4. **Process async**: Don't block the WebSocket loop; process messages asynchronously
5. **Log disconnections**: Track reconnection attempts for debugging

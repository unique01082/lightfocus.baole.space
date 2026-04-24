/**
 * Simple SSE (Server-Sent Events) implementation using native fetch
 * - No auto-retry on connection loss
 * - No inactive/hidden tab detection
 * - API compatible with @microsoft/fetch-event-source
 */

// ============================================
// Type Definitions
// ============================================

export interface MessageEvent {
  data: string;
}

export interface FetchEventSourceInit extends RequestInit {
  /**
   * Called when the response is received and parsed
   */
  onopen?: (response: Response) => Promise<void>;

  /**
   * Called for each incoming message
   */
  onmessage?: (msg: MessageEvent) => void;

  /**
   * Called when an error occurs
   */
  onerror?: (error: Error) => void;

  /**
   * Called when the connection closes
   */
  onclose?: () => void;
}

// ============================================
// SSE Stream Parser
// ============================================

async function parseSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onmessage: ((msg: MessageEvent) => void) | undefined,
  onclose: (() => void) | undefined,
): Promise<void> {
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // Stream ended
        if (onclose) {
          onclose();
        }
        break;
      }

      // Decode chunk and append to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete lines
      const lines = buffer.split('\n');

      // Keep last incomplete line in buffer
      buffer = lines[lines.length - 1];

      // Process all complete lines
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i];

        // Empty line = message boundary
        if (line === '') {
          continue;
        }

        // Comment line (starts with :)
        if (line.startsWith(':')) {
          continue;
        }

        // Parse "field: value" format
        if (line.includes(':')) {
          const [field, ...rest] = line.split(':');
          const value = rest.join(':').replace(/^ /, ''); // Remove leading space

          if (field === 'data' && onmessage) {
            onmessage({ data: value });
          }
        } else if (onmessage) {
          // Line without colon is treated as data field
          onmessage({ data: line });
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// ============================================
// Main fetchEventSource Function
// ============================================

export async function fetchEventSource(
  url: string | URL,
  eventSourceInitDict?: FetchEventSourceInit,
): Promise<void> {
  const {
    onopen,
    onmessage,
    onerror,
    onclose,
    headers,
    body,
    signal,
    method = 'GET',
    ...otherInit
  } = eventSourceInitDict ?? {};

  try {
    // Perform fetch
    const response = await fetch(url, {
      method,
      headers,
      body,
      signal,
      ...otherInit,
    });

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Call onopen callback
    if (onopen) {
      await onopen(response);
    }

    // Check if response has body
    if (!response.body) {
      throw new Error('Response body is empty');
    }

    // Get reader from response body
    const reader = response.body.getReader();

    // Parse SSE stream
    await parseSSEStream(reader, onmessage, onclose);
  } catch (error) {
    // Handle abort error separately
    if (error instanceof Error && error.name === 'AbortError') {
      if (onclose) {
        onclose();
      }
      return;
    }

    // Call error handler
    if (onerror) {
      onerror(error instanceof Error ? error : new Error(String(error)));
    } else {
      throw error;
    }
  }
}

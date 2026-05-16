import { request } from "../ai";

/** Get all memory entries with values and timestamps. GET /api/v1/memory */
export async function getAllMemories(options?: Record<string, unknown>) {
  return request<Array<{ key: string; value: unknown; updatedAt: string }>>("/api/v1/memory", {
    method: "GET",
    ...(options ?? {}),
  });
}

/** List all memory keys. GET /api/v1/memory/keys */
export async function listMemoryKeys(options?: Record<string, unknown>) {
  return request<{ keys: string[] }>("/api/v1/memory/keys", {
    method: "GET",
    ...(options ?? {}),
  });
}

/** Get a specific memory entry by key. GET /api/v1/memory/:key */
export async function getMemory(
  key: string,
  options?: Record<string, unknown>,
) {
  return request<{ key: string; value: unknown }>(`/api/v1/memory/${key}`, {
    method: "GET",
    ...(options ?? {}),
  });
}

/** Set or update a memory entry. PUT /api/v1/memory/:key */
export async function upsertMemory(
  key: string,
  value: Record<string, unknown>,
  options?: Record<string, unknown>,
) {
  return request<{ ok: true }>(`/api/v1/memory/${key}`, {
    method: "PUT",
    data: { value },
    ...(options ?? {}),
  });
}

/** Delete a specific memory entry. DELETE /api/v1/memory/:key */
export async function deleteMemory(
  key: string,
  options?: Record<string, unknown>,
) {
  return request<{ ok: true }>(`/api/v1/memory/${key}`, {
    method: "DELETE",
    ...(options ?? {}),
  });
}

/** Clear all memories for the current user. DELETE /api/v1/memory */
export async function clearAllMemories(options?: Record<string, unknown>) {
  return request<{ ok: true }>("/api/v1/memory", {
    method: "DELETE",
    ...(options ?? {}),
  });
}

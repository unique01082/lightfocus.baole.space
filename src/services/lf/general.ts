import { request } from "../services"
import type { LF } from "./typings";

/** Health check Simple health check endpoint GET /api/v1 */
export async function appControllerGetHello(
  options ?: {[key: string]: any}
) {
  return request<string>('/api/v1', {
  method: 'GET',
    ...(options || {}),
  });
}

/** Debug information Returns debug information about JWT configuration, JWKS endpoint, and environment (public endpoint) GET /api/v1/debug */
export async function appControllerGetDebugInfo(
  options ?: {[key: string]: any}
) {
  return request<{ 'timestamp'?: string; 'server_time'?: number; 'timezone'?: string; 'jwt'?: { 'provided'?: boolean; 'decoded'?: Record<string, any>; }; 'jwks'?: { 'uri'?: string; 'data'?: Record<string, any>; }; 'config'?: Record<string, any>; 'env_check'?: Record<string, any>; 'headers'?: Record<string, any>; }>('/api/v1/debug', {
  method: 'GET',
    ...(options || {}),
  });
}


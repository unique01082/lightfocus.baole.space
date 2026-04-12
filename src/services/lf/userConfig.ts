import { request } from "../services";
import type { LF } from "./typings";

/** Get user configuration Returns the ranking algorithm configuration for the authenticated user. Creates default config if none exists. GET /api/v1/user-config */
export async function userConfigControllerGetConfig(options?: {
  [key: string]: any;
}) {
  return request<LF.UserConfigEntity>("/api/v1/user-config", {
    method: "GET",
    ...(options || {}),
  });
}

/** Create or replace user configuration Creates or completely replaces the user configuration. Use PATCH for partial updates. PUT /api/v1/user-config */
export async function userConfigControllerUpsertConfig(
  body: LF.CreateUserConfigDto,
  options?: { [key: string]: any }
) {
  return request<LF.UserConfigEntity>("/api/v1/user-config", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Update user configuration Partially updates the user configuration. Only provided fields will be updated. PATCH /api/v1/user-config */
export async function userConfigControllerUpdateConfig(
  body: LF.UpdateUserConfigDto,
  options?: { [key: string]: any }
) {
  return request<LF.UserConfigEntity>("/api/v1/user-config", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Reset to default configuration Resets user configuration to default BALANCED algorithm POST /api/v1/user-config/reset */
export async function userConfigControllerResetConfig(options?: {
  [key: string]: any;
}) {
  return request<LF.UserConfigEntity>("/api/v1/user-config/reset", {
    method: "POST",
    ...(options || {}),
  });
}

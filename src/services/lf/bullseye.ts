import { request } from "../services"
import type { LF } from "./typings";

/** Get BullseyeRank visualization data Returns all user tasks with calculated ranks (1-7) and grouped by orbit for visualization. Rank 1 is most important (closest to sun), rank 7 is least important. GET /api/v1/bullseye */
export async function bullseyeControllerGetRankedTasks(
  options ?: {[key: string]: any}
) {
  return request<LF.BullseyeResponseEntity>('/api/v1/bullseye', {
  method: 'GET',
    ...(options || {}),
  });
}


import { GoogleRouteLeg } from "@/lib/utils/google-routes/google-routes";
import { ResidentRequestDataBaseResponseWithDuration } from "./database-query-results/resident-request-database-response";

export type TimeSlotBodyData = {
  legs: GoogleRouteLeg[];
  waypoints: ResidentRequestDataBaseResponseWithDuration[];
};
export type OptimizedResidentRequestData = {
  MOR?: TimeSlotBodyData;
  DAY?: TimeSlotBodyData;
  EVE?: TimeSlotBodyData;
};

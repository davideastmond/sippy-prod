import { collateDailyRequests } from "./collateDailyRequests";
import { ResidentRequestCollation } from "@/types/resident-request-collation";

export async function generateRoutes(requests: Record<string, ResidentRequestCollation[]>) {
  try {
    const result = await collateDailyRequests(requests);
    console.log("Collated Requests:", result);
    return result;
  } catch (error) {
    console.error("Error generating routes:", error);
    throw error;
  }
}

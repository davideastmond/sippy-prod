import { ResidentRequestCollation } from "../../types/resident-request-collation";

export async function fetchDailyRequests(): Promise<ResidentRequestCollation[]> {
  try {
    const response = await fetch("/api/request-schedule");
    if (!response.ok) {
      throw new Error("Failed to fetch requests");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching daily requests:", error);
    throw error;
  }
}

export async function collateDailyRequests(): Promise<ResidentRequestCollation[]> {
  const requests = await fetchDailyRequests();

  const groupedRequests: Record<string, ResidentRequestCollation[]> = {
    Morning: [],
    Noon: [],
    Afternoon: [],
  };

  for (const request of requests) {
    if (!request.address || !request.address.latitude || !request.address.longitude) {
      console.warn(`Skipping request ${request.id} due to missing address information.`);
      continue;
    }

    const startTime = new Date(request.requestedTimeSlot.startTime).getHours();
    if (startTime >= 8 && startTime < 11) {
      groupedRequests["Morning"].push(request);
    } else if (startTime >= 11 && startTime < 14) {
      groupedRequests["Noon"].push(request);
    } else if (startTime >= 14 && startTime < 17) {
      groupedRequests["Afternoon"].push(request);
    }
  }

  return Object.values(groupedRequests).flat();
}

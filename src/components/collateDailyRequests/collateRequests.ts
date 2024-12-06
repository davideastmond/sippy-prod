import { ResidentRequestCollation } from "../../types/resident-request-collation";
import { getTimeSlotHours } from "@/lib/utils/time-slot/time-slot";
import { TimeSlot } from "@/types/time-slot";


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
    [TimeSlot.Morning]: [],
    [TimeSlot.Daytime]: [],
    [TimeSlot.Evening]: [],
  };

  for (const request of requests) {
    if (!request.address || !request.address.latitude || !request.address.longitude) {
      console.warn(`Skipping request ${request.id} due to missing address information.`);
      continue;
    }

    const startTime = new Date(request.requestedTimeSlot.startTime).getHours();
    for (const timeSlot of Object.values(TimeSlot)) {
      const [startHour, endHour] = getTimeSlotHours(timeSlot);
      if (startTime >= startHour && startTime < endHour) {
        groupedRequests[timeSlot].push(request);
        break;
      }
    }
  }

  return Object.values(groupedRequests).flat();
}

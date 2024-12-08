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

// match time slor
function determineTimeSlot(startTime: number): TimeSlot | null {
  for (const timeSlot of Object.values(TimeSlot)) {
    const [startHour, endHour] = getTimeSlotHours(timeSlot);
    if (startTime >= startHour && startTime < endHour) {
      return timeSlot;
    }
  }
  return null; // No matching time slot
}

export async function collateDailyRequests(): Promise<Record<TimeSlot, ResidentRequestCollation[]>> {
  const requests = await fetchDailyRequests();

  // Use `Record<TimeSlot, ResidentRequestCollation[]>` for strict typing
  const groupedRequests: Record<TimeSlot, ResidentRequestCollation[]> = {
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
    const timeSlot = determineTimeSlot(startTime);

    if (timeSlot) {
      groupedRequests[timeSlot].push(request);
    } else {
      console.warn(`Request ${request.id} does not fall into any defined time slot.`);
    }
  }

  return groupedRequests;
}

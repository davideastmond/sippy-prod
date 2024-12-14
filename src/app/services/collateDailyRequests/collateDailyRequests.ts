import { ResidentRequestCollation } from "@/types/resident-request-collation";
import dayjs from "dayjs";

export async function collateDailyRequests(
  date: string
): Promise<ResidentRequestCollation[]> {
  try {
    const response = await fetch(`/api/request-schedule`);
    if (!response.ok) {
      throw new Error(`Failed to fetch requests: ${response.statusText}`);
    }

    const allRequests: ResidentRequestCollation[] = await response.json();
    console.log("Fetched all requests from API:", allRequests);

    // Filter requests by local timezone date
    const filteredRequests = allRequests.filter((request) => {
      const requestDate = new Date(request.requestedTimeSlot.startTime);

      // Convert UTC to local date without time
      const localDate = new Date(
        requestDate.getUTCFullYear(),
        requestDate.getUTCMonth(),
        requestDate.getUTCDate()
      );

      // Compare with the selected date
      return dayjs(localDate).format("YYYY-MM-DD") === date;
    });

    console.log(`Filtered requests for date ${date}:`, filteredRequests);
    return filteredRequests;
  } catch (error) {
    console.error("Error fetching or filtering requests:", error);
    throw error;
  }
}

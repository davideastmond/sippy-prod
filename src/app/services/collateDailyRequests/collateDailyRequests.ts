import { ResidentRequestCollation } from "@/types/resident-request-collation";

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

    //filter by date
    const filteredRequests = allRequests.filter((request) => {
      const requestDate = new Date(request.requestedTimeSlot.startTime)
        .toISOString()
        .split("T")[0];
      return requestDate === date;
    });

    console.log(`Filtered requests for date ${date}:`, filteredRequests);
    return filteredRequests;
  } catch (error) {
    console.error("Error fetching or filtering requests:", error);
    throw error;
  }
}

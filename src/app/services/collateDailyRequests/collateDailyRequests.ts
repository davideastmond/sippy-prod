import { ResidentRequestCollation } from "@/types/resident-request-collation";

export async function collateDailyRequests(
  date: string
): Promise<ResidentRequestCollation[]> {
  try {
    // Send POST request to backend with the selected date
    const response = await fetch(`/api/request-schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date }), // Send the date to the backend
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch requests: ${response.statusText}`);
    }

    const requestAtDate: ResidentRequestCollation[] = await response.json();

    return requestAtDate;
  } catch (error) {
    console.error("Error fetching or adjusting requests:", error);
    throw error;
  }
}

import { ResidentRequestCollation } from "@/types/resident-request-collation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function collateDailyRequests(
  date: string,
): Promise<ResidentRequestCollation[]> {
  try {
    console.log("Sending request to backend with date:", date); // Log before sending the request

    // Send POST request to backend with the selected date
    const response = await fetch(`/api/request-schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date }), // Send the date to the backend
    });

    if (!response.ok) {
      const errorText = await response.text(); // Read the error message from the response
      console.error("Backend error response:", errorText); // Log the error response
      throw new Error(`Failed to fetch requests: ${response.statusText}`);
    }

    const requestAtDate: ResidentRequestCollation[] = await response.json();
    console.log("Fetched all requests from API:", requestAtDate);

    // Adjust UTC times to the client's local time zone

    return requestAtDate;
  } catch (error) {
    console.error("Error fetching or adjusting requests:", error);
    throw error;
  }
}

import { getTimeSlotHours } from "@/lib/utils/time-slot/time-slot";
import { ResidentRequestDatabaseResponse } from "@/types/database-query-results/resident-request-database-response";
import { TimeSlot } from "@/types/time-slot";
import dayjs from "dayjs";

export interface GroupedRequestsByRequestedTimeSlot {
  [TimeSlot.Morning]: ResidentRequestDatabaseResponse[];
  [TimeSlot.Daytime]: ResidentRequestDatabaseResponse[];
  [TimeSlot.Evening]: ResidentRequestDatabaseResponse[];
}

/**
 *
 * @param residentRequests all resident pending requests for a given date.
 * @returns Groups the resient requests by MOR, DAY, EVE time slots.
 */
export function groupRequestsByTimeslot(
  residentRequests: ResidentRequestDatabaseResponse[]
): GroupedRequestsByRequestedTimeSlot {
  const groupedRequests: GroupedRequestsByRequestedTimeSlot = {
    [TimeSlot.Morning]: [],
    [TimeSlot.Daytime]: [],
    [TimeSlot.Evening]: [],
  };

  residentRequests.forEach((request) => {
    const startHour = dayjs(request.requestedTimeSlot.startTime).get("hour");

    switch (startHour) {
      case getTimeSlotHours(TimeSlot.Morning)[0]:
        groupedRequests[TimeSlot.Morning].push(request);
        break;
      case getTimeSlotHours(TimeSlot.Daytime)[0]:
        groupedRequests[TimeSlot.Daytime].push(request);
        break;
      case getTimeSlotHours(TimeSlot.Evening)[0]:
        groupedRequests[TimeSlot.Evening].push(request);
        break;
      default:
        console.error("Invalid time slot");
        throw new Error("Invalid time slot");
    }
  });

  return groupedRequests;
}

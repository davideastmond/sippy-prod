import {
  computeRoute,
  RouteResponseData,
} from "@/lib/utils/google-routes/google-routes";
import {
  ResidentRequestDatabaseResponse,
  ResidentRequestDataBaseResponseWithDuration,
} from "@/types/database-query-results/resident-request-database-response";
import { OptimizedResidentRequestData } from "@/types/optimized-resident-request-data";
import { TimeSlot } from "@/types/time-slot";
import dayjs from "dayjs";
import { GroupedRequestsByRequestedTimeSlot } from "./group-requests-by-slot";

const VISIT_DURATION_SECONDS = 60 * 40; // 40 minutes

export async function computeRouteByGroupedRequests(
  forDate: string,
  requestGroup: GroupedRequestsByRequestedTimeSlot
): Promise<OptimizedResidentRequestData> {
  let combinedRequests = {};

  for await (const [section, data] of Object.entries(requestGroup)) {
    if (data.length > 0) {
      try {
        const res = await computeRoute({
          timeSlot: section as TimeSlot,
          forDate,
          groupedLatLongs: data.map((r: ResidentRequestDatabaseResponse) => ({
            latitude: r.address!.latitude,
            longitude: r.address!.longitude,
          })),
        });
        combinedRequests = {
          ...combinedRequests,
          [section]: {
            ...res,
            waypoints: getWaypointOrder(data, res),
          },
        };
      } catch (error) {
        console.error(
          `Error computing route for ${section}:`,
          (error as Error).message
        );
        throw error;
      }
    }
  }

  return combinedRequests;
}

function getWaypointOrder(
  residentRequests: ResidentRequestDatabaseResponse[],
  googleResponseData: RouteResponseData
) {
  const waypointOrder: ResidentRequestDataBaseResponseWithDuration[] = [];
  let elapsedTime = 0;
  googleResponseData.legs.forEach((leg) => {
    // First waypoint endlocation should be the first request
    const request = residentRequests.find((r) => {
      const wayPointExists = Boolean(waypointOrder.find((w) => w.id === r.id));
      return (
        fallBackCompare(
          leg.startLocation.latLng.latitude,
          r.address!.latitude
        ) &&
        fallBackCompare(
          leg.startLocation.latLng.longitude,
          r.address!.longitude
        ) &&
        !wayPointExists
      );
    });
    if (request) {
      const parsedTravelTime_seconds = parseInt(leg.duration.slice(0, -1), 10);
      elapsedTime += parsedTravelTime_seconds;

      const timeStamp = dayjs(request.requestedTimeSlot.startTime);
      const startTime = dayjs(request.requestedTimeSlot.startTime).add(
        elapsedTime,
        "second"
      );
      waypointOrder.push({
        ...request,
        duration: parsedTravelTime_seconds,
        assignedTimeSlot: {
          startTime: startTime.toDate(),
          endTime: timeStamp
            .add(elapsedTime + VISIT_DURATION_SECONDS, "second")
            .toDate(),
        },
      });
      elapsedTime = elapsedTime + VISIT_DURATION_SECONDS;
    }
  });

  return waypointOrder;
}

/**
 * Fallback compare function to handle floating point errors. Google API returns lat/lng with 15 decimal places and sometimes it
 * doesn't match up. This is a hacky way of rounding and matching up lat/lngs so we can identify which request belongs to which waypoint.
 * @param firstNumber
 * @param secondNumber
 * @returns
 */
function fallBackCompare(firstNumber: number, secondNumber: number): boolean {
  if (
    parseFloat(firstNumber.toFixed(3)) === parseFloat(secondNumber.toFixed(3))
  )
    return true;

  return (
    parseFloat(firstNumber.toFixed(2)) === parseFloat(secondNumber.toFixed(2))
  );
}

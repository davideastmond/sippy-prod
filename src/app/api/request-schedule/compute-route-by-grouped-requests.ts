import {
  computeRoute,
  RouteResponseData,
} from "@/lib/utils/google-routes/google-routes";
import {
  ResidentRequestDatabaseResponse,
  ResidentRequestDataBaseResponseWithDuration,
} from "@/types/database-query-results/resident-request-database-response";
import { TimeSlot } from "@/types/time-slot";
import { GroupedRequestsByRequestedTimeSlot } from "./group-requests-by-slot";

export async function computeRouteByGroupedRequests(
  forDate: string,
  requestGroup: GroupedRequestsByRequestedTimeSlot
) {
  let combinedRequests = {};

  if (requestGroup.MOR.length > 0) {
    try {
      const res = await computeRoute({
        timeSlot: TimeSlot.Morning,
        forDate,
        groupedLatLongs: requestGroup.MOR.map((r) => ({
          latitude: r.address!.latitude,
          longitude: r.address!.longitude,
        })),
      });
      combinedRequests = {
        ...combinedRequests,
        [TimeSlot.Morning]: {
          ...res,
          waypoints: getWaypointOrder(requestGroup.MOR, res),
        },
      };
    } catch (error) {
      console.error("Error computing route for MOR:", (error as Error).message);
      throw error;
    }
  }

  if (requestGroup.DAY.length > 0) {
    try {
      const res = await computeRoute({
        timeSlot: TimeSlot.Daytime,
        forDate,
        groupedLatLongs: requestGroup.DAY.map((r) => ({
          latitude: r.address!.latitude,
          longitude: r.address!.longitude,
        })),
      });
      combinedRequests = {
        ...combinedRequests,
        [TimeSlot.Daytime]: {
          ...res,
          waypoints: getWaypointOrder(requestGroup.DAY, res),
        },
      };
    } catch (error) {
      console.error("Error computing route for DAY:", (error as Error).message);
      throw error;
    }
  }

  if (requestGroup.EVE.length > 0) {
    try {
      const res = await computeRoute({
        timeSlot: TimeSlot.Evening,
        forDate,
        groupedLatLongs: requestGroup.EVE.map((r) => ({
          latitude: r.address!.latitude,
          longitude: r.address!.longitude,
        })),
      });
      combinedRequests = {
        ...combinedRequests,
        [TimeSlot.Evening]: {
          ...res,
          waypoints: getWaypointOrder(requestGroup.EVE, res),
        },
      };
    } catch (error) {
      console.error("Error computing route for EVE:", (error as Error).message);
      throw error;
    }
  }

  return combinedRequests;
}

function getWaypointOrder(
  residentRequests: ResidentRequestDatabaseResponse[],
  googleResponseData: RouteResponseData
) {
  const waypointOrder: ResidentRequestDataBaseResponseWithDuration[] = [];
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
      waypointOrder.push({
        ...request,
        duration: parseInt(leg.duration.slice(0, -1), 10),
      });
    }
  });

  return waypointOrder;
}

function take(floatNumber: number, decimalPlaces: number = 2): number {
  return parseFloat(floatNumber.toFixed(decimalPlaces));
}

function fallBackCompare(firstNumber: number, secondNumber: number): boolean {
  if (take(firstNumber, 3) === take(secondNumber, 3)) {
    return true;
  }

  return take(firstNumber, 2) === take(secondNumber, 2);
}

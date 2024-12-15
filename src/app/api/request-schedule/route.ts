import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { computeRouteMatrix } from "@/lib/utils/google-routes";
import { TimeSlot } from "@/types/time-slot";
import dayjs from "dayjs";
// import { object } from "zod";
import { getTimeSlotHours } from "@/lib/utils/time-slot/time-slot";

interface Route {
  originIndex: number;
  destinationIndex: number;
  duration: string;
  condition: string;
}

// interface RequestBody {
//   date: string; // Expected date input in "YYYY-MM-DD" format
// }

function determineTimeSlot(accumulatedTime: number, dateContext: Date):{startTime : Date, endTime: Date} {
  console.log("determineTimeSlot", accumulatedTime, dateContext);
  const hour = Math.floor(accumulatedTime / 3600); // Convert seconds to hours
  if (hour >= getTimeSlotHours(TimeSlot.Morning)[0] && hour < getTimeSlotHours(TimeSlot.Morning)[1]) 
    return {startTime: dayjs(dateContext).add(1, "day").set("hours", getTimeSlotHours(TimeSlot.Morning)[0]).toDate(),
      endTime: dayjs(dateContext).add(1, "day").set("hours", getTimeSlotHours(TimeSlot.Morning)[1]).toDate(),
    };
  if (hour >= getTimeSlotHours(TimeSlot.Daytime)[0] && hour < getTimeSlotHours(TimeSlot.Daytime)[1]) 
    return {startTime: dayjs(dateContext).add(1, "day").set("hours", getTimeSlotHours(TimeSlot.Daytime)[0]).toDate(),
      endTime: dayjs(dateContext).add(1, "day").set("hours", getTimeSlotHours(TimeSlot.Daytime)[1]).toDate(),
    };
  if (hour >= getTimeSlotHours(TimeSlot.Evening)[0] && hour < getTimeSlotHours(TimeSlot.Evening)[1]) 
    return {startTime: dayjs(dateContext).add(1, "day").set("hours", getTimeSlotHours(TimeSlot.Evening)[0]).toDate(),
      endTime: dayjs(dateContext).add(1, "day").set("hours", getTimeSlotHours(TimeSlot.Evening)[1]).toDate(),
    };

  throw new Error("Unable to determine time slot for the given hour");
}

function optimizeRoute(routeMatrix: number[][]): number[] {
  const numLocations = routeMatrix.length;
  const visited = new Set<number>();
  const order: number[] = [];
  let currentLocation = 0;

  while (order.length < numLocations) {
    visited.add(currentLocation);
    order.push(currentLocation);

    let nearestNeighbor = -1;
    let shortestDistance = Infinity;
    for (let i = 0; i < numLocations; i++) {
      if (!visited.has(i) && routeMatrix[currentLocation][i] < shortestDistance) {
        shortestDistance = routeMatrix[currentLocation][i];
        nearestNeighbor = i;
      }
    }

    if (nearestNeighbor === -1) break;
    currentLocation = nearestNeighbor;
  }

  return order;
}

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();
    const { date } = requestBody;
    console.log("Backend Received request with date:", date);

    if (!date) {
      console.error("Missing 'date' in request body");
      return NextResponse.json(
        { error: "Missing required 'date' in request body" },
        { status: 400 }
      );
    }
    const requestStartTime = new Date(date);
    const requestEndTime = dayjs(date).set("hour", 23).set("minute", 59).set("second", 59).toDate();
    console.log("req date object with date:", requestStartTime);
    console.log("req date object end time:", requestEndTime);
    // Fetch requests for the specific date and status PENDING
    const residentRequests = await prisma.residentRequest.findMany({
      where: {
        status: "PENDING",
        requestedTimeSlot: {
          startTime: {
            gte: requestStartTime,
            lt: `${date}T23:59:59Z`,
          },
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        requestedTimeSlot: true,
        address: true,
      },
    });
    console.log("line 87");
    if (residentRequests.length === 0) {
      return NextResponse.json({ message: "No requests found for the given date." });
    }

    const optimizedResults = [];

    // Process requests
    const locations = residentRequests.map((req) => ({
      latitude: req.address!.latitude,
      longitude: req.address!.longitude,
    }));

    const routes = await computeRouteMatrix({
      origins: locations,
      destinations: locations,
      travelMode: "DRIVE",
    });

    const routeMap: Record<string, Route> = routes.reduce((map, route) => {
      map[`${route.originIndex}-${route.destinationIndex}`] = route;
      return map;
    }, {} as Record<string, Route>);
    // Create a route matrix
    const routeMatrix: number[][] = Array.from({ length: locations.length }, () =>
      Array(locations.length).fill(Infinity)
    );

    routes.forEach((route) => {
      const durationInSeconds = parseInt(route.duration.replace("s", ""), 10);
      routeMatrix[route.originIndex][route.destinationIndex] = durationInSeconds;
    });

    // Optimize route
    const optimizedOrder = optimizeRoute(routeMatrix);

    // Start time: 8 AM
    let accumulatedTime = 8 * 60 * 60;
    const stopDuration = 60 * 60; // 1 hour per stop

    // Reorder requests, assign time slots, and persist in the database
    for (const index of optimizedOrder) {
      const currentRequest = residentRequests[index];
      const nextIndex = (index + 1) % residentRequests.length;

      const travelTime = routeMatrix[index][nextIndex];
      const timeSlot = determineTimeSlot(accumulatedTime, new Date(date));
      console.log("determined timeSlot:", timeSlot);

      // Increment accumulated time by the stop duration and travel time
      accumulatedTime += stopDuration + travelTime;
      console.log("line 135 cree req + id:", currentRequest.id );
      
      // Update the assigned time slot in the database
      const updatedRequest = await prisma.residentRequest.update({
        where: { id: currentRequest.id },
        data: {
          assignedTimeSlot: {
            create: {
              startTime: timeSlot.startTime,
              endTime: timeSlot.endTime,
            }
          },
        },
      });
      console.log("updatedRequest:", updatedRequest); 
      optimizedResults.push({
        ...updatedRequest,
        address: currentRequest.address,
        user: currentRequest.user,
        travelTime,
        route: routeMap[`${index}-${nextIndex}`],
      });
    }
    console.log("optimizedResults:", JSON.stringify(optimizedResults, null, 2));
    return NextResponse.json(optimizedResults);
  } catch (error) {
    console.error("Error fetching or updating requests:", error);
    return NextResponse.json({ error: "request schedule failed" }, { status: 500 });
  }
}

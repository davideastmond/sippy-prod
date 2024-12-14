import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { computeRouteMatrix } from "@/lib/utils/google-routes";
import { TimeSlot } from "@/types/time-slot";

interface Route {
  originIndex: number;
  destinationIndex: number;
  duration: string;
  condition: string;
}

function determineTimeSlot(accumulatedTime: number): TimeSlot {
  const hour = Math.floor(accumulatedTime / 3600); // Convert seconds to hours

  if (hour >= 8 && hour < 11) return TimeSlot.Morning;
  if (hour >= 11 && hour < 14) return TimeSlot.Daytime;
  if (hour >= 14 && hour < 17) return TimeSlot.Evening;

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

export async function GET() {
  try {
    const residentRequests = await prisma.residentRequest.findMany({
      where: { status: "PENDING" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        requestedTimeSlot: true,
        address: true,
      },
    });

    // Group requests by day
    const requestsByDay = residentRequests.reduce((acc, request) => {
      if (!request.address) return acc; // Skip requests without addresses
      const day = new Date(request.requestedTimeSlot.startTime).toISOString().split("T")[0];
      acc[day] = acc[day] || [];
      acc[day].push(request);
      return acc;
    }, {} as Record<string, typeof residentRequests>);

    const optimizedResults = [];

    for (const [day, requests] of Object.entries(requestsByDay)) {
      if (requests.length < 2) {
        optimizedResults.push(...requests);
        continue;
      }

      // Extract locations
      const locations = requests.map((req) => ({
        latitude: req.address!.latitude,
        longitude: req.address!.longitude,
      }));

      // Compute route matrix
      const routes = await computeRouteMatrix({
        origins: locations,
        destinations: locations,
        travelMode: "DRIVE",
      });

      if (!routes || routes.length === 0) {
        console.error(`Route optimization failed for day: ${day}`);
        optimizedResults.push(...requests);
        continue;
      }

      // Create a route map
      const routeMap: Record<string, Route> = routes.reduce((map, route) => {
        map[`${route.originIndex}-${route.destinationIndex}`] = route;
        return map;
      }, {} as Record<string, Route>);

      // Initialize route matrix
      const routeMatrix: number[][] = Array.from({ length: locations.length }, () =>
        Array(locations.length).fill(Infinity)
      );

      routes.forEach((route) => {
        const durationInSeconds = parseInt(route.duration.replace("s", ""), 10); // Convert "160s" to 160
        routeMatrix[route.originIndex][route.destinationIndex] = durationInSeconds;
      });

      // Optimize route
      const optimizedOrder = optimizeRoute(routeMatrix);

      // Initialize the starting time (8:00 AM in seconds)
      let accumulatedTime = 8 * 60 * 60; // Start time in seconds (8:00 AM)
      const stopDuration = 60 * 60; // Assume 1 hour per stop in seconds

      // Reorder requests and assign time slots
      const optimizedRequests = optimizedOrder.map((index, idx) => {
        const currentRequest = requests[index];
        const nextIndex = (idx + 1) % requests.length;

        const travelTime = routeMatrix[index][nextIndex]; // Travel time in seconds

        // Determine the time slot based on accumulated time
        const timeSlot = determineTimeSlot(accumulatedTime);

        // Increment accumulated time by the stop duration and travel time
        accumulatedTime += stopDuration + travelTime;

        return {
          ...currentRequest,
          timeSlot, // Assign the time slot
          travelTime, // Add travel time to the response
          route: routeMap[`${index}-${nextIndex}`], // Add route details
        };
      });

      optimizedResults.push(...optimizedRequests);
    }

    return NextResponse.json(optimizedResults);
  } catch (error) {
    console.error("Error optimizing routes:", error);
    return NextResponse.error();
  }
}

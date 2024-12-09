import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { computeRouteMatrix } from "@/lib/utils/google-routes";

export async function GET() {
  try {
    // Fetch resident requests with address and user details
    const residentRequests = await prisma.residentRequest.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        requestedTimeSlot: true,
        address: true,
      },
    });

    // Filter requests with valid addresses
    const validRequests = residentRequests.filter(
      (request) => request.address && request.address.latitude && request.address.longitude
    );

    if (validRequests.length < 2) {
      // If less than two valid requests, no optimization is needed
      return NextResponse.json(validRequests);
    }

    // Extract locations for route optimization
    const locations = validRequests.map((req) => ({
      latitude: req.address!.latitude as number,
      longitude: req.address!.longitude as number,
    }));

    // Perform route optimization using Google Routes API
    const routes = await computeRouteMatrix({
      origins: locations,
      destinations: locations,
      travelMode: "DRIVE",
    });

    // Enrich the requests with route information
    const enrichedRequests = validRequests.map((request, index) => ({
      ...request,
      route: routes.find((route) => route.originIndex === index),
    }));

    return NextResponse.json(enrichedRequests);
  } catch (error) {
    console.error("Error optimizing routes:", error);
    return NextResponse.error();
  }
}

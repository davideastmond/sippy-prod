import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { computeRouteByGroupedRequests } from "./compute-route-by-grouped-requests";
import { groupRequestsByTimeslot } from "./group-requests-by-slot";

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();
    const { date } = requestBody;

    if (!date) {
      console.error("Missing 'date' in request body");
      return NextResponse.json(
        { error: "Missing required 'date' in request body" },
        { status: 400 }
      );
    }
    const requestStartTime = new Date(date);

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

    if (residentRequests.length === 0) {
      return NextResponse.json({
        message: "No requests found for the given date.",
      });
    }

    try {
      const fetchedRequests = await computeRouteByGroupedRequests(
        date,
        groupRequestsByTimeslot(residentRequests)
      );

      return NextResponse.json(fetchedRequests);
    } catch (error) {
      console.error("Error fetching or updating requests:", error);
      return NextResponse.json(
        { error: "request schedule failed" + (error as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(
      "Error fetching or updating requests:",
      (error as Error).message
    );
    return NextResponse.json(
      { error: "request schedule failed" },
      { status: 500 }
    );
  }
}

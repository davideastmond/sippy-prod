import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function adminGetResidentsRequests({
  take,
  skip,
}: {
  take: number;
  skip: number;
}) {
  try {
    // Simply get all resident requests with pagination.
    const count = await prisma.residentRequest.count();
    const residentRequests = await prisma.residentRequest.findMany({
      select: {
        id: true,
        requestedTimeSlot: { select: { startTime: true, endTime: true } },
        assignedTimeSlot: { select: { startTime: true, endTime: true } },
        address: true,
        status: true,
        createdAt: true,
        user: {
          select: { id: true, name: true, email: true, phoneNumber: true },
        },
      },
      skip: skip,
      take: take,
    });
    return { residentRequests, count };
  } catch (error) {
    console.log("Error fetching resident request:", error);
    return NextResponse.json(
      { error: "Failed to fetch resident request" },
      { status: 500 }
    );
  }
}

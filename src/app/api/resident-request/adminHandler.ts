import { prisma } from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function adminGetResidentsRequests(status: RequestStatus | "all") {
  const validStatuses: string[] = [
    RequestStatus.COMPLETED,
    RequestStatus.PENDING,
    RequestStatus.CANCELED,
    "all",
  ];

  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { error: "Invalid status parameter" },
      { status: 400 }
    );
  }

  try {
    if (status === "all") {
      // Simply get all resident requests. TODO: pagination
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
      });
      return residentRequests;
    }

    // TODO: keeping this here incase we need. Think about pagination
    const residentRequests = await prisma.residentRequest.findMany({
      where: { status: status as RequestStatus },
      include: {
        user: true,
        requestedTimeSlot: true,
      },
    });

    return residentRequests;
  } catch (error) {
    console.error("Error fetching resident request:", error);
    return NextResponse.json(
      { error: "Failed to fetch resident request" },
      { status: 500 }
    );
  }
}

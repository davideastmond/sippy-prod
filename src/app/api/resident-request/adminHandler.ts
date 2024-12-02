import { NextResponse } from "next/server";
import { RequestStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function adminGetResidentsRequests (status: RequestStatus){

  
    const validStatuses: RequestStatus[] = [
      RequestStatus.COMPLETED,
      RequestStatus.PENDING,
      RequestStatus.CANCELED,
    ];
   
   
    if (!validStatuses.includes(status as RequestStatus)) {
      return NextResponse.json({ error: "Invalid status parameter" }, { status: 400 });
    }
   
    try {
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
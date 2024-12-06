import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  // Get the current date and time
  const currentDate = new Date();

  // Determine if we are past 20:00 today
  const isAfterCutoff = currentDate.getHours() >= 20;

  // Set the start and end times
  const startOfDay = new Date(currentDate);
  const endOfDay = new Date(currentDate);

  if (isAfterCutoff) {
    // If after 20:00, start at 20:00 of the previous day and end at 20:00 today
    startOfDay.setDate(startOfDay.getDate() - 1);
    startOfDay.setHours(20, 0, 0, 0);
    endOfDay.setHours(20, 0, 0, 0);
  } else {
    // If before 20:00, start at 20:00 of the day before yesterday and end at 20:00 yesterday
    startOfDay.setDate(startOfDay.getDate() - 2);
    startOfDay.setHours(20, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() - 1);
    endOfDay.setHours(20, 0, 0, 0);
  }

  // Query for requests within the calculated time range
  const residentRequests = await prisma.residentRequest.findMany({
    where: {
      requestedTimeSlot: {
        startTime: { gte: startOfDay, lte: endOfDay },
      },
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      requestedTimeSlot: true, // Include the requested time slot details
      address: { select: { latitude: true, longitude: true, city: true } }, // Include lat/lon
    },
  });

  // Return the data as a JSON response
  return NextResponse.json(residentRequests);
}

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { timeSlotIsAvailable } from "./timeslotHandle";

export async function GET() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const { startTime, endTime } = await req.json();

  // Convert startTime and endTime to Date objects
  const start = new Date(startTime);
  let end = new Date(endTime);

  // Define the cutoff hour (20:00)
  const cutOffHour = 20;

  // Check if the request falls outside allowed hours
  if (start.getHours() >= cutOffHour || end.getHours() >= cutOffHour) {
    // Move to the next day
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0); 
    end = new Date(start); // Reset end time based on the new start
    end.setHours(1); // Example: duration of 1 hour
  }

  // Check if the adjusted time slot is available
  const isAvailable = await timeSlotIsAvailable(start, end);

  if (!isAvailable) {
    return NextResponse.json({ error: "Time slot is fully booked" }, { status: 400 });
  }

  // If time slot is available, return success message
  return NextResponse.json({ message: "Time slot is available", start, end });
}

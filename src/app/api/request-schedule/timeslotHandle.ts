import { prisma } from "@/lib/prisma";

export async function timeSlotIsAvailable(startTime: Date, endTime: Date) {
  // Count overlapping requests for the same time slot
  const overlappingRequests = await prisma.residentRequest.count({
    where: {
      requestedTimeSlot: {
        startTime,
        endTime,
      },
    },
  });

  // Return true if fewer than 3 overlapping requests exist, false otherwise
  return overlappingRequests < 3;
}

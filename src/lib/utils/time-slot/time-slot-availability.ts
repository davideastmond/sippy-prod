import { prisma } from "@/lib/prisma";
const MAX_REQUESTS_PER_SLOT = 3;

/**
 * This returns if a requested time slot is available.
 * This is used to help enabled / disable the time-range picker on the submission request form * @param startTime
 * @returns
 */
export async function isRequestedTimeSlotAvailable(
  startTime: Date
): Promise<boolean> {
  const requestBookings = await prisma.residentRequest.count({
    where: {
      requestedTimeSlot: {
        startTime: startTime,
      },
    },
  });

  return requestBookings < MAX_REQUESTS_PER_SLOT;
}

import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
const MAX_REQUESTS_PER_SLOT = 3;

/**
 * This returns if a requested time slot is available.
 * This is used to help enabled / disable the time-range picker on the submission request form * @param startTime
 * @returns
 */
export async function isRequestedTimeSlotAvailable(
  startTime: Date
): Promise<boolean> {
  let modifiedStartTime = startTime;
  // Again there are issues with production DB dates and dev env
  if (process.env.NODE_ENV === "production") {
    modifiedStartTime = dayjs(startTime).add(-1, "day").toDate();
    console.warn("17 modifiedStartTime", modifiedStartTime);
  }
  const requestBookings = await prisma.residentRequest.count({
    where: {
      requestedTimeSlot: {
        startTime: modifiedStartTime,
      },
    },
  });

  return requestBookings < MAX_REQUESTS_PER_SLOT;
}

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
  let formattedStartTime: Date | string = startTime;
  if (process.env.NODE_ENV === "production") {
    formattedStartTime = dayjs(startTime).format("YYYY-MM-DD HH:mm:ss:SSS");
    console.log("17 ***** formattedStartTime", formattedStartTime);
  }
  const requestBookings = await prisma.residentRequest.count({
    where: {
      requestedTimeSlot: {
        startTime: formattedStartTime,
      },
    },
  });

  return requestBookings < MAX_REQUESTS_PER_SLOT;
}

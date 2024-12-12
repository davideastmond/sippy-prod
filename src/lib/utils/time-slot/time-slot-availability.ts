import { prisma } from "@/lib/prisma";
import { getTimeSlotHours } from "@/lib/utils/time-slot/time-slot";
import { TimeSlot } from "@/types/time-slot";
const MAX_REQUESTS_PER_SLOT = 3;

/**
 * Check if a given time range aligns with defined time slots.
 * @param startTime - Start time of the request
 * @param endTime - End time of the request
 * @returns Boolean indicating if the range matches a defined slot
 */
export function isWithinTimeSlot(startTime: Date, endTime: Date): boolean {
  const allTimeSlots = [
    {
      start: getTimeSlotHours(TimeSlot.Morning)[0],
      end: getTimeSlotHours(TimeSlot.Morning)[1],
    },
    {
      start: getTimeSlotHours(TimeSlot.Daytime)[0],
      end: getTimeSlotHours(TimeSlot.Daytime)[1],
    },
    {
      start: getTimeSlotHours(TimeSlot.Evening)[0],
      end: getTimeSlotHours(TimeSlot.Evening)[1],
    },
  ];

  return allTimeSlots.some((slot) => {
    const slotStart = new Date(startTime);
    const slotEnd = new Date(startTime);

    slotStart.setHours(slot.start, 0, 0, 0);
    slotEnd.setHours(slot.end, 0, 0, 0);

    return startTime >= slotStart && endTime <= slotEnd;
  });
}

/**
 * Check if a time slot is available for booking.
 * @param startTime - Start time of the request
 * @param endTime - End time of the request
 * @returns Boolean indicating if the time slot is available
 */
export async function timeSlotIsAvailable(
  startTime: Date,
  endTime: Date
): Promise<boolean> {
  const overlappingRequests = await prisma.residentRequest.count({
    where: {
      AND: [
        { requestedTimeSlot: { startTime: { lte: endTime } } },
        { requestedTimeSlot: { endTime: { gte: startTime } } },
      ],
    },
  });

  return overlappingRequests < MAX_REQUESTS_PER_SLOT;
}

/**
 * This returns if a requested time slot is available.
 * We may use this differently than the above function. This is
 * used to help enabled / disable the time-range picker on the submission request form
 * @param startTime
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

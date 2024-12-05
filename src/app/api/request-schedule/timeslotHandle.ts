import { prisma } from "@/lib/prisma";

// Define allowed time slots
const timeSlots = [
  { start: "08:00", end: "11:00" },
  { start: "11:00", end: "14:00" },
  { start: "14:00", end: "17:00" },
];

/**
 * Check if a given time range aligns with defined time slots.
 * @param startTime - Start time of the request
 * @param endTime - End time of the request
 * @returns Boolean indicating if the range matches a defined slot
 */
export function isWithinTimeSlot(startTime: Date, endTime: Date): boolean {
  return timeSlots.some((slot) => {
    const slotStart = new Date(startTime);
    const slotEnd = new Date(startTime);

    const [startHour, startMinute] = slot.start.split(":").map(Number);
    const [endHour, endMinute] = slot.end.split(":").map(Number);

    slotStart.setHours(startHour, startMinute, 0, 0);
    slotEnd.setHours(endHour, endMinute, 0, 0);

    return startTime >= slotStart && endTime <= slotEnd;
  });
}

/**
 * Check if a time slot is available for booking.
 * @param startTime - Start time of the request
 * @param endTime - End time of the request
 * @returns Boolean indicating if the time slot is available
 */
export async function timeSlotIsAvailable(startTime: Date, endTime: Date): Promise<boolean> {
  const overlappingRequests = await prisma.residentRequest.count({
    where: {
      AND: [
        { requestedTimeSlot: { startTime: { lte: endTime } } },
        { requestedTimeSlot: { endTime: { gte: startTime } } },
      ],
    },
  });

  const maxRequestsPerSlot = 3; // Maximum allowed requests per slot
  return overlappingRequests < maxRequestsPerSlot;
}

/**
 * Get all available slots for a given day.
 * @param date - The date to check for available slots
 * @returns List of available time slots
 */
export async function getAvailableSlots(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const bookedSlots = await prisma.residentRequest.findMany({
    where: {
      requestedTimeSlot: {
        startTime: { gte: startOfDay },
        endTime: { lte: endOfDay },
      },
    },
    select: { requestedTimeSlot: true },
  });

  const bookedRanges = bookedSlots.map((slot) => ({
    startTime: new Date(slot.requestedTimeSlot.startTime),
    endTime: new Date(slot.requestedTimeSlot.endTime),
  }));

  const availableSlots = timeSlots.filter((slot) => {
    const slotStart = new Date(date);
    const slotEnd = new Date(date);

    const [startHour, startMinute] = slot.start.split(":").map(Number);
    const [endHour, endMinute] = slot.end.split(":").map(Number);

    slotStart.setHours(startHour, startMinute, 0, 0);
    slotEnd.setHours(endHour, endMinute, 0, 0);

    return !bookedRanges.some(
      (booked) =>
        slotStart < booked.endTime && slotEnd > booked.startTime // Overlapping check
    );
  });

  return availableSlots;
}

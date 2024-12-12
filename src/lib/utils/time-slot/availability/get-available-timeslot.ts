import { prisma } from "@/lib/prisma";
import { TimeSlot } from "@/types/time-slot";
import { getTimeSlotHours } from "../time-slot";
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

  const availableSlots = [
    TimeSlot.Morning,
    TimeSlot.Daytime,
    TimeSlot.Evening,
  ].filter((timeSlot) => {
    const [startHour, endHour] = getTimeSlotHours(timeSlot);

    const slotStart = new Date(date);
    const slotEnd = new Date(date);

    slotStart.setHours(startHour, 0, 0, 0);
    slotEnd.setHours(endHour, 0, 0, 0);

    return !bookedRanges.some(
      (booked) => slotStart < booked.endTime && slotEnd > booked.startTime // Overlapping check
    );
  });

  return availableSlots.map((timeSlot) => ({
    label: timeSlot,
    start: getTimeSlotHours(timeSlot)[0],
    end: getTimeSlotHours(timeSlot)[1],
  }));
}

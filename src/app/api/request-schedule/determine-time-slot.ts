import { getTimeSlotHours } from "@/lib/utils/time-slot/time-slot";
import { TimeSlot } from "@/types/time-slot";
import dayjs from "dayjs";

export function determineTimeSlot(
  accumulatedTime: number,
  dateContext: Date
): { startTime: Date; endTime: Date } {
  const hour = Math.floor(accumulatedTime / 3600); // Convert seconds to hours
  const EVENING_BUFFER_TIME = 5; // 5 hours buffer for evening time slot
  if (
    hour >= getTimeSlotHours(TimeSlot.Morning)[0] &&
    hour < getTimeSlotHours(TimeSlot.Morning)[1]
  )
    return {
      startTime: dayjs(dateContext)
        .add(1, "day")
        .set("hours", getTimeSlotHours(TimeSlot.Morning)[0])
        .toDate(),
      endTime: dayjs(dateContext)
        .add(1, "day")
        .set("hours", getTimeSlotHours(TimeSlot.Morning)[1])
        .toDate(),
    };
  if (
    hour >= getTimeSlotHours(TimeSlot.Daytime)[0] &&
    hour < getTimeSlotHours(TimeSlot.Daytime)[1]
  )
    return {
      startTime: dayjs(dateContext)
        .add(1, "day")
        .set("hours", getTimeSlotHours(TimeSlot.Daytime)[0])
        .toDate(),
      endTime: dayjs(dateContext)
        .add(1, "day")
        .set("hours", getTimeSlotHours(TimeSlot.Daytime)[1])
        .toDate(),
    };
  if (
    hour >= getTimeSlotHours(TimeSlot.Evening)[0] &&
    hour < getTimeSlotHours(TimeSlot.Evening)[1] + EVENING_BUFFER_TIME
  )
    return {
      startTime: dayjs(dateContext)
        .add(1, "day")
        .set("hours", getTimeSlotHours(TimeSlot.Evening)[0])
        .toDate(),
      endTime: dayjs(dateContext)
        .add(1, "day")
        .set("hours", getTimeSlotHours(TimeSlot.Evening)[1])
        .toDate(),
    };

  throw new Error("Unable to determine time slot for the given hour");
}

import { getTimeSlotHours } from "@/lib/utils/time-slot/time-slot";
import { TimeSlot } from "@/types/time-slot";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export function assignRequestedTimeSlot(
  appointmentDate: string,
  timeSlot: TimeSlot
): { startTime: Date; endTime: Date } {
  // Requested timeslots are blocks
  const addHours = process.env.NODE_ENV === "production" ? 5 : 0;

  console.log("added hours is", addHours);
  switch (timeSlot) {
    case TimeSlot.Morning:
      return {
        startTime: dayjs(appointmentDate)
          .set("hour", getTimeSlotHours(TimeSlot.Morning)[0] + addHours)
          .set("minute", 0)
          .set("second", 0)
          .utc()
          .toDate(),
        endTime: dayjs(appointmentDate)
          .set("hour", getTimeSlotHours(TimeSlot.Morning)[1] + addHours)
          .set("minute", 0)
          .set("second", 0)
          .utc()
          .toDate(),
      };
    case TimeSlot.Daytime:
      return {
        startTime: dayjs(appointmentDate)
          .set("hour", getTimeSlotHours(TimeSlot.Daytime)[0] + addHours)
          .set("minute", 0)
          .set("second", 0)
          .utc()
          .toDate(),
        endTime: dayjs(appointmentDate)
          .set("hour", getTimeSlotHours(TimeSlot.Daytime)[1] + addHours)
          .set("minute", 0)
          .set("second", 0)
          .utc()
          .toDate(),
      };
    case TimeSlot.Evening:
      return {
        startTime: dayjs(appointmentDate)
          .set("hour", getTimeSlotHours(TimeSlot.Evening)[0] + addHours)
          .set("minute", 0)
          .set("second", 0)
          .utc()
          .toDate(),
        endTime: dayjs(appointmentDate)
          .set("hour", getTimeSlotHours(TimeSlot.Evening)[1] + addHours)
          .set("minute", 0)
          .set("second", 0)
          .utc()
          .toDate(),
      };
  }
}

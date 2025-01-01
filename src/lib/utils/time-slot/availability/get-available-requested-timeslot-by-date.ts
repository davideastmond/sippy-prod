import { TimeSlot } from "@/types/time-slot";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getTimeSlotHours } from "../time-slot";
import { isRequestedTimeSlotAvailable } from "../time-slot-availability";
dayjs.extend(utc);

export async function getAvailableRequestedTimeSlotsByDate(
  date: Date
): Promise<boolean[]> {
  // We need to check for each slot - morning, daytime, evening

  const timeslotStartTimes = {
    [TimeSlot.Morning]: {
      startTime: dayjs(date)
        .set("hour", getTimeSlotHours(TimeSlot.Morning)[0])
        .add(1, "day")
        .minute(0)
        .second(0)
        .millisecond(0)
        .utc()
        .toDate(),
    },
    [TimeSlot.Daytime]: {
      startTime: dayjs(date)
        .set("hour", getTimeSlotHours(TimeSlot.Daytime)[0])
        .add(1, "day")
        .minute(0)
        .second(0)
        .millisecond(0)
        .utc()
        .toDate(),
    },
    [TimeSlot.Evening]: {
      startTime: dayjs(date)
        .set("hour", getTimeSlotHours(TimeSlot.Evening)[0])
        .add(1, "day")
        .minute(0)
        .second(0)
        .millisecond(0)
        .utc()
        .toDate(),
    },
  };

  const requestPromises = Object.entries(timeslotStartTimes).map(
    ([, range]) => {
      return isRequestedTimeSlotAvailable(range.startTime);
    }
  );

  return Promise.all(requestPromises);
}

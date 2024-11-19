import { TimeSlot } from "@/types/time-slot";

export const getTimeSlotSummaryCaption = (timeSlot: TimeSlot) => {
  switch (timeSlot) {
    case TimeSlot.Morning:
      return `Morning between ${getTimeSlotHours(timeSlot)}`;
    case TimeSlot.Daytime:
      return `Daytime between ${getTimeSlotHours(timeSlot)}`;
    case TimeSlot.Evening:
      return `Afternoon between ${getTimeSlotHours(timeSlot)}`;
  }
};

export const getTimeSlotHours = (timeSlot: TimeSlot) => {
  switch (timeSlot) {
    case TimeSlot.Morning:
      return "8:00 - 11:00";
    case TimeSlot.Daytime:
      return "11:00 - 15:00";
    case TimeSlot.Evening:
      return "15:00 - 18:00";
  }
};

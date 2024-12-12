import { TimeSlot } from "@/types/time-slot";

export type RequestedAvailabilityApiResponse = {
  date: Date;
  availabilities: Record<TimeSlot, boolean>;
};

/* Confirm and submit screen */

import { TextLabel } from "@/components/textLabel";
import { TimeSlot } from "@/types/time-slot";
import dayjs from "dayjs";
import { FormSchemaUserFormData } from "../definitions/types";

interface ReviewSubmitProps {
  formData: Partial<FormSchemaUserFormData>;
}

/* 
  Summarize:
  - Full name
  - E-mail address
  - Address (TODO)
  - Appointment date and timeSlot
*/
export const ReviewSubmit = ({ formData }: ReviewSubmitProps) => {
  return (
    <>
      <TextLabel text="Review and Submit" fontSize="Text-20" color="Gray-100" />
      <div>
        <TextLabel text="Full Name:" fontSize="Text-14" color="Gray-100" />
        <TextLabel text={formData.name!} fontSize="Text-14" color="Green" />
      </div>
      <div>
        <TextLabel text="E-mail Address:" fontSize="Text-14" color="Gray-100" />
        <TextLabel text={formData.email!} fontSize="Text-14" color="Green" />
      </div>
      <div>
        <TextLabel text="Address:" fontSize="Text-14" color="Gray-100" />
        <TextLabel
          text={formData.address?.fullAddress! || "No address provided"}
          fontSize="Text-14"
          color="Green"
        />
      </div>
      <div>
        <TextLabel
          text="Appointment Date:"
          fontSize="Text-14"
          color="Gray-100"
        />
        <TextLabel
          text={dayjs(formData.appointmentDate).format("MMMM D, YYYY")}
          fontSize="Text-14"
          color="Green"
        />
      </div>
      <div>
        <TextLabel
          text="Requested Time Slot:"
          fontSize="Text-14"
          color="Gray-100"
        />
        <TextLabel
          text={getTimeSlotSummaryCaption(formData.timeSlot!)}
          fontSize="Text-14"
          color="Green"
        />
      </div>
    </>
  );
};

const getTimeSlotSummaryCaption = (timeSlot: TimeSlot) => {
  switch (timeSlot) {
    case TimeSlot.Morning:
      return "Morning between 8:00 - 11:00";
    case TimeSlot.Afternoon:
      return "Afternoon between 11:00 - 14:00";
    case TimeSlot.Evening:
      return "Evening between 14:00 - 17:00";
  }
};

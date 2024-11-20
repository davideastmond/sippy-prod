import { TimeSlot } from "@/types/time-slot";
import dayjs from "dayjs";
import { z } from "zod";
export const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .transform((name) => name.toLowerCase()),
  email: z.string().email({ message: "Invalid email address" }),
  address: z.object({
    fullAddress: z.string(), // TODO: This type should be defined properly
  }),
  appointmentDate: z
    .date()
    .min(dayjs().set("hour", 0).set("minute", 0).set("second", 0).toDate()),

  timeSlot: z.nativeEnum(TimeSlot),
  areaCode: z.custom(
    (value: string) => {
      const areaCodeRegex = /^[2-9]\d{2}$/;
      return areaCodeRegex.test(value);
    },
    { message: "Area code should be 3 digits" }
  ),
  phoneNumber: z.custom(
    (value: string) => {
      const phoneNumberRegEx = /^\d{7}$/;
      return phoneNumberRegEx.test(value);
    },
    { message: "Phone number should be 7 digits" }
  ),
});

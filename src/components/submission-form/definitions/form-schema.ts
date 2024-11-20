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
    .min(dayjs().set("hour", 0).set("minute", 0).set("second", 0).toDate())
    .nullable(),
  timeSlot: z.nativeEnum(TimeSlot),
  areaCode: z
    .number()
    .int()
    .min(201, { message: "Enter a valid 3-digit area code" })
    .max(999, { message: "Enter a valid 3-digit area code" }),
  phoneNumber: z
    .number()
    .int()
    .min(100000, { message: "Telephone number should be 7 digits" })
    .max(9999999, { message: "Telephone number should be 7 digits" }),
});

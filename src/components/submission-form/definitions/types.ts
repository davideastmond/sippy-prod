import { z } from "zod";
import {
  addressSchema,
  appointmentSchema,
  nameEmailPhoneSchema,
} from "./form-schemas";

export type nameEmailPhoneFormData = z.infer<typeof nameEmailPhoneSchema>;
export type appointmentFormData = z.infer<typeof appointmentSchema>;
export type addressSchemaFormData = z.infer<typeof addressSchema>;

export type FormSchemaUserFormData = nameEmailPhoneFormData &
  appointmentFormData &
  addressSchemaFormData;

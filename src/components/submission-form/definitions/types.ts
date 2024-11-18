import { z } from "zod";
import { formSchema } from "./form-schema";

export type FormSchemaUserFormData = z.infer<typeof formSchema>;

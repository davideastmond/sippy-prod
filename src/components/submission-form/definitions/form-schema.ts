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
});

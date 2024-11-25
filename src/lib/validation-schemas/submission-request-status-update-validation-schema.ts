import { RequestStatus } from "@prisma/client";
import { z } from "zod";
export const submissionRequestStatusUpdateValidationSchema = z.object({
  status: z.enum([
    RequestStatus.CANCELED,
    RequestStatus.COMPLETED,
    RequestStatus.PENDING,
  ]),
});

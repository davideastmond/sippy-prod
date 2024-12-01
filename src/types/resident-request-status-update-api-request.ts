import { RequestStatus } from "@prisma/client";

export type ResidentRequestStatusUpdateApiRequest = {
  status: RequestStatus;
};

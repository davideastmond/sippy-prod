import { RequestStatus } from "@prisma/client";

export const requestStatusColorMap = {
  [RequestStatus.CANCELED]: "bg-simmpy-red text-simmpy-gray-100",
  [RequestStatus.COMPLETED]: "bg-simmpy-green text-simmpy-gray-100",
  [RequestStatus.PENDING]: "bg-simmpy-yellow",
};

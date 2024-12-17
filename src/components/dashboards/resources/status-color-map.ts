import { RequestStatus } from "@prisma/client";

export const statusToColorMap: Record<
  RequestStatus,
  { border: string; bg: string; text: string }
> = {
  COMPLETED: {
    border: "border-green-500",
    bg: "bg-green-50",
    text: "text-green-600",
  },
  PENDING: {
    border: "border-yellow-500",
    bg: "bg-yellow-50",
    text: "text-yellow-600",
  },
  CANCELED: {
    border: "border-red-500",
    bg: "bg-red-50",
    text: "text-red-600",
  },
};

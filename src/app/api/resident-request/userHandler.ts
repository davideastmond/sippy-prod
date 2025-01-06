import { prisma } from "@/lib/prisma";

export async function getUserResidentRequest(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      requests: {
        select: {
          id: true,
          requestedTimeSlot: {
            select: {
              startTime: true,
              endTime: true,
            },
          },
          assignedTimeSlot: {
            select: {
              startTime: true,
              endTime: true,
            },
          },
          address: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });
}

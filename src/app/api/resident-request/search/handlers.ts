import { prisma } from "@/lib/prisma";

export async function adminSearch({
  query,
  statusQuery,
}: {
  query: string;
  statusQuery?: string[]; // TODO: Implement status query filter in stretch goal
}) {
  console.log(statusQuery);
  const wildCardQuery = `${query}:*`;
  const computedQuery = {
    where: {
      OR: [
        {
          user: {
            name: {
              search: wildCardQuery,
            },
          },
        },
        {
          user: {
            email: {
              search: wildCardQuery,
            },
          },
        },
        {
          user: {
            phoneNumber: {
              search: wildCardQuery,
            },
          },
        },
        {
          address: {
            streetName: {
              search: wildCardQuery,
            },
          },
        },
        {
          address: {
            streetNumber: {
              search: wildCardQuery,
            },
          },
        },
      ],
    },
    include: {
      address: true,
      requestedTimeSlot: { select: { startTime: true, endTime: true } },
      assignedTimeSlot: { select: { startTime: true, endTime: true } },
      user: {
        select: { id: true, name: true, email: true, phoneNumber: true },
      },
    },
  };

  const residentRequests = await prisma.residentRequest.findMany(computedQuery);
  return {
    residentRequests,
    count: residentRequests.length,
  };
}

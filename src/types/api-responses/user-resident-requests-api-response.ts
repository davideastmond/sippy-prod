import { Prisma } from "@prisma/client";

/* Reference: https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types
  This is to try to get type safety when we retrieve data from the API that has a partial structure of a model's type.
  For example, when we want to fetch all the requests for some user, the response has a partial structure of the User model type plus some select statements
  that reference data from related tables (requested timeSlot, address etc)

 This approach is supposed to be scalable and prevent us from having to write a lot of types for every possible combination of data we might want to fetch from the API
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userWithResidentRequests = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    requests: {
      select: {
        id: true,
        requestedTimeSlot: { select: { startTime: true, endTime: true } },
        assignedTimeSlot: { select: { startTime: true, endTime: true } },
        address: true,
        status: true,
      },
    },
  },
});

export type UserResidentRequestsApiResponse = Prisma.UserGetPayload<
  typeof userWithResidentRequests
>;

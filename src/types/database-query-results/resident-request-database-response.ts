import { Prisma } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const residentRequestDatabaseResponse =
  Prisma.validator<Prisma.ResidentRequestDefaultArgs>()({
    select: {
      id: true,
      applicantName: true,
      contactPhoneNumber: true,
      status: true,
      address: true,
      requestedTimeSlot: { select: { startTime: true, endTime: true } },
      user: {
        select: { id: true, name: true, email: true, phoneNumber: true },
      },
    },
  });

export type ResidentRequestDatabaseResponse = Prisma.ResidentRequestGetPayload<
  typeof residentRequestDatabaseResponse
>;

export type ResidentRequestDataBaseResponseWithDuration =
  ResidentRequestDatabaseResponse & {
    duration: number;
    assignedTimeSlot?: {
      startTime: Date | string | null | undefined;
      endTime: Date | string | null | undefined;
    };
  };

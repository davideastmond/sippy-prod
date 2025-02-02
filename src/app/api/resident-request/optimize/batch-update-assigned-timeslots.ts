import { prisma } from "@/lib/prisma";
import { ResidentRequestDataBaseResponseWithDuration } from "@/types/database-query-results/resident-request-database-response";
import { OptimizedResidentRequestData } from "@/types/optimized-resident-request-data";
import { TimeSlot } from "@/types/time-slot";

/**
 * Takes the optimized resident requests and updates the assigned time slots in the database
 * @param requests
 */
export async function batchUpdateAssignedTimeSlotsInDb(
  requests: OptimizedResidentRequestData
): Promise<void> {
  // Take the waypoints and update the assigned time slots

  // Should be all of the waypoints regardless of time slot

  const waypoints = Object.keys(requests).reduce(
    (acc: ResidentRequestDataBaseResponseWithDuration[], curr) => {
      return (acc = acc.concat(requests[curr as TimeSlot]!.waypoints!));
    },
    []
  );

  await prisma.$transaction(
    waypoints.map((waypoint) => {
      return prisma.residentRequest.update({
        where: {
          id: waypoint.id,
        },
        data: {
          assignedTimeSlot: {
            create: {
              startTime: waypoint.assignedTimeSlot!.startTime!,
              endTime: waypoint.assignedTimeSlot!.endTime!,
            },
          },
        },
      });
    })
  );
}

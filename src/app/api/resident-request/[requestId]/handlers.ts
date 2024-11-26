import { prisma } from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";

/* 
  Rules to think about:
  - Users should be able to cancel a request in pending status
  - Admins are able to cancel a pending request, or mark it as completed
  - Admins can revert a completed request back to pending
  - Admins can't cancel a completed request?
*/

// These functions define the things that can be done with the request based on the user's role
export async function updateResidentRequestStatusFromUser(
  requestId: string,
  action: RequestStatus
) {
  // All a user can do is cancel their own request (if it's in pending status)
  if (action === RequestStatus.CANCELED) {
    await prisma.residentRequest.update({
      where: { id: requestId, status: RequestStatus.PENDING },
      data: { status: RequestStatus.CANCELED },
    });
  } else {
    throw new Error("Non admin user is requesting an invalid action");
  }
}

export async function updateResidentRequestStatusFromAdmin(
  requestId: string,
  action: RequestStatus
) {
  // Admins can cancel a pending request, mark pending as completed, or revert a completed request back to pending
  switch (action) {
    case RequestStatus.CANCELED:
      await prisma.residentRequest.update({
        where: { id: requestId, status: RequestStatus.PENDING },
        data: { status: RequestStatus.CANCELED },
      });
      break;
    case RequestStatus.COMPLETED:
      // Mark as completed
      await prisma.residentRequest.update({
        where: { id: requestId, status: RequestStatus.PENDING },
        data: { status: RequestStatus.COMPLETED },
      });
      break;
    case RequestStatus.PENDING:
      await prisma.residentRequest.update({
        where: { id: requestId, status: RequestStatus.COMPLETED },
        data: { status: RequestStatus.PENDING },
      });
      break;
    default:
      throw new Error("Invalid action requested by admin");
  }
}

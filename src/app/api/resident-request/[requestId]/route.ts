import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { submissionRequestStatusUpdateValidationSchema } from "@/lib/validation-schemas/submission-request-status-update-validation-schema";
import { ResidentRequestStatusUpdateApiRequest } from "@/types/resident-request-status-update-api-request";
import { RequestStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
/* 
  Rules to think about:
  - Users should be able to cancel a request in pending status
  - Admins are able to cancel a pending request, or mark it as completed
  - Admins can revert a completed request back to pending
  - Admins can't cancel a completed request?
*/

export async function PATCH(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  const session = await getServerSession(authOptions);

  // If there is no authentication session, return a 401 Unauthorized response
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let requestBody: ResidentRequestStatusUpdateApiRequest;
  try {
    requestBody = await req.json();
    submissionRequestStatusUpdateValidationSchema.parse(requestBody);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ errors: error }, { status: 400 });
  }

  // What requestor wants to update the status to
  const { status } = requestBody;

  if (session.user.isAdmin) {
    try {
      await handleResidentRequestFromAdmin(params.requestId, status);
      return NextResponse.json({
        message: "Resident request was updated by admin",
      });
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
  }

  // Otherwise this is a user request
  try {
    await handleResidentRequestFromUser(params.requestId, status);
    return NextResponse.json({
      message: "Resident request was updated by user",
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}

// Request handlers that define the things that can be done with the request?
async function handleResidentRequestFromUser(
  requestId: string,
  action: RequestStatus
) {
  // All a user can do is cancel their own request (if it's in pending status)
  if (action === RequestStatus.CANCELED) {
    await prisma.residentRequest.update({
      where: { id: requestId, status: RequestStatus.PENDING },
      data: { status: RequestStatus.CANCELED },
    });
  }
}

async function handleResidentRequestFromAdmin(
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
  }
}

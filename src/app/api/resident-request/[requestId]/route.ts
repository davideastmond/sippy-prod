import { authOptions } from "@/auth";
import { submissionRequestStatusUpdateValidationSchema } from "@/lib/validation-schemas/submission-request-status-update-validation-schema";
import { ResidentRequestStatusUpdateApiRequest } from "@/types/resident-request-status-update-api-request";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  handleResidentRequestFromAdmin,
  handleResidentRequestFromUser,
} from "./handlers";
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

  // Status represents the action that the user or admin wants to take
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

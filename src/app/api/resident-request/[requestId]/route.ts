import { authOptions } from "@/auth";
import { residentRequestStatusUpdateValidationSchema } from "@/lib/validation-schemas/resident-request-status-update-validation-schema";
import { sendStatusUpdateEmail } from '@/lib/mailer/email-senders/update-request-email-sender';
import { ResidentRequestStatusUpdateApiRequest } from "@/types/resident-request-status-update-api-request";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  updateResidentRequestStatusFromAdmin,
  updateResidentRequestStatusFromUser,
} from "./handlers";

export async function PATCH(
  req: NextRequest,
  segmentData: { params: Promise<{ requestId: string }> }
) {
  const session = await getServerSession(authOptions);

  // If there is no authentication session, return a 401 Unauthorized response
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { requestId } = await segmentData.params;
  let requestBody: ResidentRequestStatusUpdateApiRequest;
  try {
    requestBody = await req.json();
    residentRequestStatusUpdateValidationSchema.parse(requestBody);
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
      await updateResidentRequestStatusFromAdmin(requestId, status);

      // Sending the status update email
      await sendStatusUpdateEmail({
        email: session.user.email!,
        requestId,
        status,
      });
      
      return NextResponse.json({
        message: "Resident request was updated by admin",
      });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }
  }

  // Otherwise this is a user request
  try {
    await updateResidentRequestStatusFromUser(requestId, status);

    // Sending the status update email
    await sendStatusUpdateEmail({
      email: session.user.email!,
      requestId,
      status,
    });

    return NextResponse.json({
      message: "Resident request was updated by user",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}

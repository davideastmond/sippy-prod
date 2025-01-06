import { sendConfirmedTimeSlotEmail } from "@/lib/mailer/email-senders/confirmed-timeslot-email-sender";
import { OptimizedResidentRequestData } from "@/types/optimized-resident-request-data";
import dayjs from "dayjs";

/**
 * This function gathers all of the waypoint data from the optimized resident request data
 * and sends an email to each resident with their assigned time slot.
 * The input should already have the optimized resident request data.
 * @param optmizedResidentRequestData
 */
export async function sendAppointmentConfirmationEmails(
  optmizedResidentRequestData: OptimizedResidentRequestData
): Promise<void> {
  const requests = Object.values(optmizedResidentRequestData).reduce(
    (acc: Promise<void>[], curr) => {
      const promises = curr.waypoints.map((waypoint) => {
        return sendConfirmedTimeSlotEmail({
          email: waypoint.user.email,
          requestId: waypoint.id,
          assignedTimeSlot: dayjs(waypoint.assignedTimeSlot!.startTime).format(
            "MMM-DD-YYYY HH:mm"
          ),
          name: waypoint.applicantName || waypoint.user.name,
        });
      });
      return (acc = acc.concat(promises));
    },
    []
  );

  await Promise.all(requests);
}

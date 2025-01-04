import { Mailer } from "../mailer";

export async function sendConfirmedTimeSlotEmail({
  email,
  requestId,
  assignedTimeSlot,
  name,
}: {
  email: string;
  requestId: string;
  assignedTimeSlot: string;
  name: string;
}) {
  const mailer = new Mailer();
  try {
    await mailer.sendMail({
      to: email,
      subject: `Sippy Panels Request Time Slot Confirmation Request# ${requestId}`,
      text: `Dear ${name}, \n Your estimated time slot has been confirmed for ${assignedTimeSlot} \n\n This is our best estimate, and can be subject to change depending on traffic conditions. \n\n Thank you for choosing Sippy Panels.`,
      html: `<html>
            <h1>Dear ${name},</h1>
            <p>Your appointment time has been confirmed for <b>${assignedTimeSlot}.</b></p>
            <p>Please note that this is an estimation. Actual visit times depend on scheduling and traffic factors.</p>
            <br />
            <p><b>Thank you for choosing Sippy Panels.</b></p>
            </html>`,
    });
    console.info("Email sent successfully for requestId" + requestId);
  } catch (error) {
    console.error(
      "There was an error sending the confirmed time slot email for requestId: " +
        requestId
    );
    console.error(error);
  }
}

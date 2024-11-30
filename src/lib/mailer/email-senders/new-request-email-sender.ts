import { Mailer } from "../mailer";

export async function sendNewRequestConfirmationEmail({
  name,
  email,
  formattedAppointmentDateTime,
  formattedAddress,
}: {
  name: string;
  email: string;
  formattedAppointmentDateTime: string;
  formattedAddress: string;
}) {
  const mailer = new Mailer();
  try {
    await mailer.sendMail({
      to: email,
      subject: "Sippy Panels Request Received",
      text: `Dear ${name}, your request has been received. /n Details: /n Service Address: ${formattedAddress} /n Request Appointment Date and Time: ${formattedAppointmentDateTime} /n Note that the chosen requested appointment time is tentative. /n You will receive a confirmation email once your request has been scheduled. /n Thank you for choosing Sippy Panels.`,
      html: `<html>
            <h1>Dear ${name}, your request has been received.</h1>
            <br />
            <h2><b>Details:</b></h2>
            <p><b>Service Address:</b> ${formattedAddress}</p>
            <p><b>Request Appointment Date and Time:</b> ${formattedAppointmentDateTime}</p>
            <br />
            <p>Please note: the chosen requested appointment time is tentative.</p>
            <p>You will receive a confirmation email once your request has been scheduled.</p>
            <br />
            <p><b>Thank you for choosing Sippy Panels.</b></p>
            </html>`,
    });
  } catch (error) {
    console.error(
      "There was an error sending the new request confirmation email"
    );
    console.error(error);
  }
}

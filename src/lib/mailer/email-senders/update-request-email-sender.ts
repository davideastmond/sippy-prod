import { Mailer } from "../mailer";

export async function sendStatusUpdateEmail({
  email,
  requestId,
  status,
}: {
  email: string;
  requestId: string;
  status: string;
}) {
  const mailer = new Mailer();
  try {
    await mailer.sendMail({
      to: email,
      subject: "Sippy Panels Request Status Update",
      text: `Dear user, the status of your request (ID: ${requestId}) has been updated. \n\n New Status: ${status} \n\n Thank you for choosing Sippy Panels.`,
      html: `<html>
            <h1>Dear user,</h1>
            <p>The status of your request (ID: <b>${requestId}</b>) has been updated.</p>
            <br />
            <h2><b>New Status:</b> ${status}</h2>
            <br />
            <p><b>Thank you for choosing Sippy Panels.</b></p>
            </html>`,
    });
  } catch (error) {
    console.error(
      "There was an error sending the status update email"
    );
    console.error(error);
  }
}

import { Mailer } from "@/lib/mailer/mailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "All fields (name, email, message) are required." },
      { status: 400 }
    );
  }

  try {
    const mailer = new Mailer();

    await mailer.sendMail({
      to: "admin@sippy.com",
      subject: "New Contact Form Submission",
      text: `You have a new message from ${name} (${email}):\n${message}`,
      html: `
        <p>You have a new message from <strong>${name}</strong> (${email}):</p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json(
      { success: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}

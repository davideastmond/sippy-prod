import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const adminZodSchema = z.object({
  username: z.custom((value) => {
    return value === process.env.ADMIN_USERNAME;
  }),
  password: z.custom((value) => {
    return value === process.env.ADMIN_PASSWORD;
  }),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "No session" }, { status: 401 });
  }

  try {
    const requestBody = await req.json();
    adminZodSchema.parse(requestBody);
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json({ errors: error.issues }, { status: 400 });

    return NextResponse.json({ errors: error }, { status: 400 });
  }

  // Update the session user to be an admin
  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { isAdmin: true },
    });
    console.log(`User ${session.user.email} is now an admin`);
    return NextResponse.json({ status: "OK" });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json(
      { message: `Failed to set authenticated user as admin: ${errorMessage}` },
      { status: 500 }
    );
  }
}

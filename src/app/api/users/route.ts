import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, phoneNumber, firstName, lastName } = await req.json();

    const user = await prisma.user.create({
      data: {
        isAdmin: false,
        email,
        phoneNumber,
        firstName,
        lastName,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Something wrong here" }, { status: 500 });
  }
}
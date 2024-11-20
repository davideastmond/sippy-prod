import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const POST = auth(async function POST(req) {
  if (req.auth) {
    console.log(req.auth?.user);
    return NextResponse.json({ message: "Hello" });
  }
  return NextResponse.json({ message: "No session" }, { status: 401 });
});

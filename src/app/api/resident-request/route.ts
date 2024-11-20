import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "No session" }, { status: 401 });
  }

  const requestBody = await req.json();

  console.info("Request body", requestBody);
  return NextResponse.json({ message: "Request received" });
});

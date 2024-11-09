import { NextResponse } from "next/server";

// This is just for test. TODO: Remove this file
export async function GET() {
  return NextResponse.json({ message: "Hello from the API!" });
}

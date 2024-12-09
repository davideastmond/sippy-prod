import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { adminSearch } from "./handlers";
// This is the search route for resident requests
// We should allow search by user name, user email, user phone number, request status, and request address

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "No session" }, { status: 401 });
  }

  if (!session.user.isAdmin)
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const textQuery = searchParams.get("query");
  const statusQuery = searchParams.getAll("status");

  try {
    const results = await adminSearch({ query: textQuery!, statusQuery });
    return NextResponse.json(results);
  } catch (error) {
    console.error("_error", error);
    return NextResponse.json({ message: "Failed to search" }, { status: 400 });
  }
}

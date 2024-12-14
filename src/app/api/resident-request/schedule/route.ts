import { authOptions } from "@/auth";
import { getAvailableRequestedTimeSlotsByDate } from "@/lib/utils/time-slot/availability/get-available-requested-timeslot-by-date";
import { TimeSlot } from "@/types/time-slot";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "No session" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  // Expecting a date string in the format "YYYY-MM-DD"
  const dateQuery = searchParams.get("date");

  if (!dateQuery) {
    return NextResponse.json(
      { message: "No date query provided" },
      { status: 400 }
    );
  }

  try {
    const queryDate = new Date(dateQuery);

    const slotAvailabilities = await getAvailableRequestedTimeSlotsByDate(
      queryDate
    );

    const apiResponse = {
      date: queryDate,
      availabilities: {
        [TimeSlot.Morning]: slotAvailabilities[0],
        [TimeSlot.Daytime]: slotAvailabilities[1],
        [TimeSlot.Evening]: slotAvailabilities[2],
      },
    };
    return NextResponse.json(apiResponse);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get available slots", error },
      { status: 500 }
    );
  }
}

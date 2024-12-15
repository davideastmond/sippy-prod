import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, timeSlot } = await req.json(); // Expect `id` and `timeSlot` in the body

    if (!id || !timeSlot) {
      return NextResponse.json(
        { error: "Missing id or timeSlot in request body" },
        { status: 400 }
      );
    }

    // Update the assigned time slot for the given request
    const updatedRequest = await prisma.residentRequest.update({
      where: { id },
      data: {
        assignedTimeSlot: {
          connect: { id: timeSlot },
        },
      },
      include: { assignedTimeSlot: true },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error updating time slot:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

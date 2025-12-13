import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import connectDB from "@/lib/db";
import Parcel from "@/models/Percel";

// -------------------- PATCH — Assign Agent --------------------
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // 🔐 Only ADMIN can assign agent
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } =await context.params;
    const body = await req.json();
    const { agentId } = body;

    if (!agentId) {
      return NextResponse.json(
        { message: "agentId is required" },
        { status: 400 }
      );
    }

    const updatedParcel = await Parcel.findByIdAndUpdate(
      id,
      {
        agent: agentId,
        status: "Picked Up",
      },
      { new: true }
    ).populate("agent", "name email");

    if (!updatedParcel) {
      return NextResponse.json(
        { message: "Parcel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedParcel, { status: 200 });
  } catch (error) {
    console.error("ASSIGN AGENT ERROR:", error);

    return NextResponse.json(
      { message: "Failed to assign agent" },
      { status: 500 }
    );
  }
}

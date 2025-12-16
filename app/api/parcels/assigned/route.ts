import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import connectDB from "@/lib/db";
import Parcel from "@/models/Parcel";

export async function GET() {
  try {
    // ✅ Get logged-in user
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // ✅ Find parcels assigned to this agent
    const parcels = await Parcel.find({
      agent: session.user.id,
      status: { $in: ["Pending", "Picked Up", "In Transit"] },
    })
      .sort({ createdAt: -1 })
      .populate("customer", "name email")
      .populate("agent", "name email");

    return NextResponse.json({ parcels }, { status: 200 });
  } catch (error) {
    console.error("ASSIGNED PARCELS ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

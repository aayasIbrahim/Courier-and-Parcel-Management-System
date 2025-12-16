import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Parcel from "@/models/Parcel";

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // connect to MongoDB via Mongoose

    const { parcelId, status } = await req.json();

    if (!parcelId || !status) {
      return NextResponse.json(
        { error: "Parcel ID and status are required" },
        { status: 400 }
      );
    }

    // Update parcel using Mongoose
    const parcel = await Parcel.findByIdAndUpdate(
      parcelId,
      { status },
      { new: true }
    );

    if (!parcel) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Status updated successfully",
      parcel,
    });
  } catch {
    console.error("Error updating parcel status");
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

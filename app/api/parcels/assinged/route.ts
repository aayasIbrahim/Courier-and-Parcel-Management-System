import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Parcel from "@/models/Percel";

// Example: you can pass agentId via query or get from auth session
export async function GET(req: NextRequest) {
  try {
    await connectDB(); // connect to MongoDB

    // Optional: get agentId from query string
    const url = new URL(req.url);
    const agentId = url.searchParams.get("agentId");
    if (!agentId) {
      return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
    }

    // Find parcels assigned to this agent
    const parcels = await Parcel.find({ agentId }).sort({ createdAt: -1 });

    return NextResponse.json({ parcels });
  } catch {
    console.error("Error fetching assigned parcels");
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

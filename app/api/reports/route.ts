import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import dbConnect from "@/lib/db";
import Parcel from "@/models/Percel";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const parcels = await Parcel.find();

  const summary = {
    totalParcels: parcels.length,
    booked: parcels.filter(p => p.status === "Booked").length,
    inTransit: parcels.filter(p => p.status === "In Transit").length,
    delivered: parcels.filter(p => p.status === "Delivered").length,
    failed: parcels.filter(p => p.status === "Failed").length,
  };

  return NextResponse.json(summary, { status: 200 });
}

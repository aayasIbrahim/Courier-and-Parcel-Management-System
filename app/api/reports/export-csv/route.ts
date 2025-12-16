import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import dbConnect from "@/lib/db";
import Parcel from "@/models/Parcel";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const parcels = await Parcel.find()
    .populate("customer", "name email")
    .populate("agent", "name email");

  const headers = [
    "Parcel ID",
    "Status",
    "Pickup",
    "Delivery",
    "Customer",
    "Agent",
  ];

  const rows = parcels.map((p) => [
    p._id,
    p.status,
    p.pickupAddress,
    p.deliveryAddress,
    p.customer?.name || "",
    p.agent?.name || "",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(String).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="parcel-report.csv"',
    },
  });
}

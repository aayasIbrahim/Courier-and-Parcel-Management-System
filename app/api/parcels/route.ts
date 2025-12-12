import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Parcel from "@/models/Percel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

// -------------------- GET ALL PARCELS --------------------
export async function GET() {
  // session must include request + authOptions
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  // ADMIN → get all parcels
  if (session.user.role === "admin") {
    const parcels = await Parcel.find().populate("customer agent");
    return NextResponse.json(parcels);
  }

  // CUSTOMER → get own parcels
  if (session.user.role === "customer") {
    const parcels = await Parcel.find({ customer: session.user.id }).populate(
      "agent"
    );
    return NextResponse.json(parcels);
  }

  return NextResponse.json({ message: "Forbidden" }, { status: 403 });
}

// -------------------- CREATE PARCEL (CUSTOMER ONLY) --------------------
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "customer") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await dbConnect();

  const data = await request.json();
  const { pickupAddress, deliveryAddress, size, type, paymentType } = data;
  console.log("Received parcel data:", data);
  const newParcel = await Parcel.create({
    pickupAddress,
    deliveryAddress,
    size,
    type,
    paymentType,
    customer: session.user.id,
  });

  return NextResponse.json(newParcel, { status: 201 });
  console.log("Parcel created:", newParcel);
}

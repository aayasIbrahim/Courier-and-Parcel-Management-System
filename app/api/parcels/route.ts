import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import dbConnect from "@/lib/db";
import Parcel, { IParcel } from "@/models/Parcel";

interface ParcelFilter {
  customer?: string;
  agent?: string;
  status?: IParcel["status"];
}

const validStatuses: IParcel["status"][] = [
  "Booked",
  "Picked Up",
  "In Transit",
  "Delivered",
  "Failed",
];

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");

    // Type guard: only assign if valid
    let status: IParcel["status"] | undefined;
    if (
      statusParam &&
      validStatuses.includes(statusParam as IParcel["status"])
    ) {
      status = statusParam as IParcel["status"];
    }

    const filter: ParcelFilter = {};

    // Role-based filtering
    if (session.user.role === "customer") {
      filter.customer = session.user.id;
    } else if (session.user.role === "agent") {
      filter.agent = session.user.id;
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    const parcels = await Parcel.find(filter)
      .populate("customer", "name email")
      .populate("agent", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(parcels, { status: 200 });
  } catch (error) {
    console.error("GET PARCELS ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// -------------------- CREATE PARCEL (CUSTOMER ONLY) --------------------
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "customer") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const { pickupAddress, deliveryAddress, size, type, paymentType } =
      await request.json();

    // ✅ Validation
    if (!pickupAddress || !deliveryAddress || !size || !type) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const newParcel = await Parcel.create({
      pickupAddress,
      deliveryAddress,
      size,
      type,
      paymentType: paymentType || "COD",
      status: "Booked",
      customer: session.user.id,
    });

    return NextResponse.json(
      {
        message: "Parcel booked successfully",
        parcel: newParcel,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PARCEL ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

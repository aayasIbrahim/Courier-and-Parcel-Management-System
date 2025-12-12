import { NextResponse } from "next/server";
import Parcel from "@/models/Percel";
import connectDB from "@/lib/db";

// GET — Single Parcel
export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const parcel = await Parcel.findById(params.id);

    if (!parcel) {
      return NextResponse.json(
        { message: "Parcel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(parcel, { status: 200 });
  } catch  {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH — Update Parcel
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const body = await req.json();

    const updatedParcel = await Parcel.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedParcel) {
      return NextResponse.json(
        { message: "Parcel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedParcel, { status: 200 });
  } catch  {
    return NextResponse.json(
      { message: "Failed to update parcel" },
      { status: 500 }
    );
  }
}

// DELETE — Delete Parcel
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const deletedParcel = await Parcel.findByIdAndDelete(params.id);

    if (!deletedParcel) {
      return NextResponse.json(
        { message: "Parcel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Parcel deleted successfully" },
      { status: 200 }
    );
  } catch  {
    return NextResponse.json(
      { message: "Failed to delete parcel" },
      { status: 500 }
    );
  }
}

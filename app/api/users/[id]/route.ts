import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// ✅ Change user role
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { role } = await req.json();

    // 🔑 IMPORTANT FIX
    const { id } = await context.params;

    await dbConnect();

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update role" },
      { status: 500 }
    );
  }
}

// ❌ Delete user
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 🔑 IMPORTANT FIX
    const { id } = await context.params;

    await dbConnect();

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}

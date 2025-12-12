import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// GET /api/user/profile → fetch user profile
// PUT /api/user/profile → update user profile

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = req.headers.get("user._id"); // For demo, you can send userId in headers
    if (!userId) return NextResponse.json({ error: "User ID missing" }, { status: 400 });

    const user = await User.findById(userId).select("-password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const userId = req.headers.get("user._id");
    if (!userId) return NextResponse.json({ error: "User ID missing" }, { status: 400 });

    const body = await req.json();
    const { name, email, phone } = body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

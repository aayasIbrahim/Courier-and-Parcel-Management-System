import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectDB();

  const user = await User.findById(session.user.id).select(
    "name email role phone address createdAt"
  );

  return NextResponse.json(user);
}

// ✅ UPDATE PROFILE
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, phone, address } = await req.json();

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { name, phone, address },
      { new: true }
    ).select("name email role phone address");

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}

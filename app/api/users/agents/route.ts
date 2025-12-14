import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized", users: [] },
        { status: 401 }
      );
    }

    await dbConnect();

    const agents = await User.find({ role: "agent" }).select("-password");

    return NextResponse.json(
      { users: agents ?? [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET AGENTS ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", users: [] },
      { status: 500 }
    );
  }
}

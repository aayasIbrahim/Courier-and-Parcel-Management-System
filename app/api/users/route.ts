import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);

    // ---------------- Query params ----------------
    const role = searchParams.get("role");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const filter = role ? { role } : {};

    // Total users for pagination
    const totalUsers = await User.countDocuments(filter);

    // Fetch paginated users
    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // newest first

    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json(
      {
        users: users ?? [],
        pagination: {
          totalUsers,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", users: [], pagination: {} },
      { status: 500 }
    );
  }
}

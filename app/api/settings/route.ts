import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings"; // MongoDB model
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    let settings = await Settings.findOne({});
    if (!settings) {
      // If no settings exist, create default
      settings = await Settings.create({
        companyName: "My Company",
        supportEmail: "support@example.com",
      });
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const body = await req.json();
    const updatedSettings = await Settings.findOneAndUpdate({}, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSettings) {
      return NextResponse.json({ message: "Settings not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSettings, { status: 200 });
  } catch (error) {
    console.error("PATCH settings error:", error);
    return NextResponse.json({ message: "Failed to update settings" }, { status: 500 });
  }
}

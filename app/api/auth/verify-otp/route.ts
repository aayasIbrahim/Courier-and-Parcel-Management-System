import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, otp } = await req.json();
    console.log("Verifying OTP for:", email, otp);

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP required" },
        { status: 400 }
      );
    }

    const otpDoc = await Otp.findOne({ email });
    if (!otpDoc) {
      return NextResponse.json(
        { message: "OTP not found or expired" },
        { status: 400 }
      );
    }

    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return NextResponse.json(
        { message: "OTP expired" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(otp, otpDoc.otp);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // ✅ Verify user
    await User.updateOne(
      { email },
      { isVerified: true }
    );

    // ✅ Remove OTP
    await Otp.deleteMany({ email });

    return NextResponse.json(
      { message: "Account verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

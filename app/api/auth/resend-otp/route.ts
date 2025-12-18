import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateOTP } from "@/lib/otp";
import { sendEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (user.isVerified) return NextResponse.json({ message: "User already verified" }, { status: 400 });

    // Generate new OTP & hash
    const otp = generateOTP(6);
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save OTP in DB (overwrite existing)
    await Otp.findOneAndUpdate(
      { email },
      { otp: hashedOtp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      { upsert: true }
    );

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      html: `<p>Hello,</p><p>Your new OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (err) {
    console.error("Resend OTP error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

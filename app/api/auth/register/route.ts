import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { generateOTP } from "@/lib/otp";
import { sendEmail } from "@/lib/mail"; // 

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password, phone, address } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already used" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: "customer", // default customer
      isVerified: false,
    });

    // Generate OTP & hash
    const otp = generateOTP(6);
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save OTP in DB
    await Otp.create({
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
    });
 console.log("📧 Sending OTP email to:", email);
    // Send OTP via email
    await sendEmail({
      to: email,
      subject: "Verify your account - OTP",
      html: `<p>Hello ${name},</p><p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });

    return NextResponse.json(
      { message: "Registration successful, OTP sent", userId: user._id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register API Error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

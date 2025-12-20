import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { generateOTP } from "@/lib/otp";
import { sendEmail } from "@/lib/mail";

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

    // 🔍 Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { message: "Email already used" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;

    if (existingUser && !existingUser.isVerified) {
      user = existingUser;
      user.name = name;
      user.password = hashedPassword;
      user.phone = phone;
      user.address = address;
      await user.save();
    }

    if (!existingUser) {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        role: "customer",
        isVerified: false,
      });
    }

    /* ================= RATE LIMITING START ================= */

    // ⏱️ Max 3 OTP per 10 minutes
    const TEN_MINUTES = 10 * 60 * 1000;

    const otpCount = await Otp.countDocuments({
      email,
      createdAt: { $gte: new Date(Date.now() - TEN_MINUTES) },
    });

    if (otpCount >= 3) {
      return NextResponse.json(
        {
          message:
            "Too many OTP requests. Please try again after 10 minutes.",
        },
        { status: 429 }
      );
    }

    // ⏳ Cooldown: active OTP exists
    const activeOtp = await Otp.findOne({
      email,
      expiresAt: { $gt: new Date() },
    });

    if (activeOtp) {
      return NextResponse.json(
        {
          message:
            "OTP already sent. Please wait until it expires before requesting again.",
        },
        { status: 429 }
      );
    }

    /* ================= RATE LIMITING END ================= */

    const otp = generateOTP(6);
    const hashedOtp = await bcrypt.hash(otp, 10);

    // 🧹 Cleanup old OTPs
    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
      createdAt: new Date(),
    });

    await sendEmail({
      to: email,
      subject: "🔒 Verify Your Account – OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Hello ${name},</h2>
          <p>Your OTP is:</p>
          <p style="font-size:24px;font-weight:bold;">${otp}</p>
          <p>This code will expire in 5 minutes.</p>
          <p style="font-size:12px;color:#777;">Do not share this code.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "OTP sent successfully" },
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

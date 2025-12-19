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

    // 🔍 Check existing user by email
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

    // 🔒 Check for existing OTP (cooldown to prevent spam)
    const existingOtp = await Otp.findOne({ email });
    if (existingOtp && existingOtp.expiresAt > new Date()) {
      return NextResponse.json(
        { message: "OTP already sent. Please wait before requesting again." },
        { status: 429 }
      );
    }

    const otp = generateOTP(6);
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({ email }); // remove old OTP
    await Otp.create({
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    });

    console.log("📧 Sending OTP email to:", email);

    await sendEmail({
      to: email,
      subject: "🔒 Verify Your Account – OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
          <h2 style="color: #0d6efd;">Hello ${name},</h2>
          <p>Thank you for creating an account with us. To complete your registration, please use the OTP below:</p>
          <p style="font-size: 24px; font-weight: bold; color: #0d6efd; margin: 20px 0;">${otp}</p>
          <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 12px; color: #777;">If you did not request this, please ignore this email.</p>
          <p style="font-size: 12px; color: #777;">Developed with ❤️ by Ayas Ibrahim</p>
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



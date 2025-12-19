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

    // ✅ Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // 🔍 Check existing user by email
    const existingUser = await User.findOne({ email });

    // ❌ If user exists AND already verified → BLOCK
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { message: "Email already used" },
        { status: 409 }
      );
    }

    // 🔐 Hash password (used for both new & unverified user)
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;

    // 🔁 If user exists but NOT verified → update info (BEST PRACTICE)
    if (existingUser && !existingUser.isVerified) {
      user = existingUser;
      user.name = name;
      user.password = hashedPassword;
      user.phone = phone;
      user.address = address;
      await user.save();
    }

    // 🆕 If no user exists → create new unverified user
    if (!existingUser) {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        role: "customer", // default role
        isVerified: false, // ⚠️ IMPORTANT
      });
    }

    // 🔢 Generate OTP
    const otp = generateOTP(6);

    // 🔐 Hash OTP before saving
    const hashedOtp = await bcrypt.hash(otp, 10);

    // 🧹 Delete old OTP if exists (important for resend)
    await Otp.deleteMany({ email });

    // 💾 Save OTP
    await Otp.create({
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
    });

    console.log("📧 Sending OTP email to:", email);

    // 📧 Send OTP email
    await sendEmail({
      to: email,
      subject: "🔒 Verify Your Account – OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
          <h2 style="color: #0d6efd;">Hello ${name},</h2>
          <p>Thank you for creating an account with us. To complete your registration, please use the OTP below:</p>
          <p style="font-size: 24px; font-weight: bold; color: #0d6efd; margin: 20px 0;">
            ${otp}
          </p>
          <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 12px; color: #777;">
            If you did not request this, please ignore this email.
          </p>
          <p style="font-size: 12px; color: #777;">
            Developed with ❤️ by Ayas Ibrahim
          </p>
        </div>
      `,
    });

    // ✅ Same response for new & unverified user (security best practice)
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


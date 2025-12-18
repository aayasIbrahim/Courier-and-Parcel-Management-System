import mongoose, { Document, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "agent" | "customer";
  phone?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "agent", "customer"],
      default: "customer",
    },
    phone: {
      type: String,
      default: "",
    },
    isVerified: { type: Boolean, default: false },
    address: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite issues in Next.js hot reload
const User = models.User || mongoose.model<IUser>("User", userSchema);

export default User;

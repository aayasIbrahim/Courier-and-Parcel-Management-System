import mongoose, { Schema, Document } from "mongoose";

export interface ITracking extends Document {
  parcel: mongoose.Types.ObjectId;
  status: string;
  location?: {
    lat: number;
    lng: number;
  };
  note?: string;
  timestamp: Date;
}

const trackingSchema = new Schema<ITracking>(
  {
    parcel: {
      type: Schema.Types.ObjectId,
      ref: "Parcel",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "created",
        "assigned",
        "picked_up",
        "in_transit",
        "delivered",
        "failed",
      ],
      required: true,
    },

    location: {
      lat: { type: Number },
      lng: { type: Number },
    },

    note: {
      type: String,
      default: "",
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Tracking ||
  mongoose.model<ITracking>("Tracking", trackingSchema);

import mongoose, { Schema, Document } from "mongoose";
export interface ILocation {
  lat: number;
  lng: number;
  timestamp?: Date;
}
export interface IParcel extends Document {
  pickupAddress: string;
  deliveryAddress: string;
  size: string;
  type: string;
  paymentType: "COD" | "Prepaid";
  status: "Booked" | "Picked Up" | "In Transit" | "Delivered" | "Failed";
  customer?: string; // userId
  agent?: string;
  currentLocation?: ILocation;
  locationHistory: ILocation[]; 
  createdAt: Date;
  updatedAt: Date;
}
const LocationSchema = new Schema({
  lat: Number,
  lng: Number,
  timestamp: { type: Date, default: Date.now },
});

const parcelSchema = new Schema<IParcel>(
  {
    pickupAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    size: { type: String, required: true },
    type: { type: String, required: true },
    paymentType: { type: String, enum: ["COD", "Prepaid"], default: "Prepaid" },
    status: {
      type: String,
      enum: ["Booked", "Picked Up", "In Transit", "Delivered", "Failed"],
      default: "Booked",
    },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    agent: { type: Schema.Types.ObjectId, ref: "User" },
    currentLocation: LocationSchema,
    locationHistory: [LocationSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Parcel ||
  mongoose.model<IParcel>("Parcel", parcelSchema);

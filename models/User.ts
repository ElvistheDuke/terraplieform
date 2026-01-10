import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  // Identity
  name: string;
  email: string;
  age: number;
  phone: string;
  address: string;
  sex: "Male" | "Female" | "Other";

  // Metrics
  weight: number;
  weightUnit: "kg" | "lbs";
  activityLevel: "Sedentary" | "Light" | "Moderate" | "Very Active";
  fitnessGoal: "Lose Weight" | "Maintain Weight" | "Gain Muscle";

  // Health
  allergies: string[];
  healthConditions: string[];

  // Palate
  spiceLevel: number;
  frequentMeal: string;
  bestFood: string;
  worstFood: string;

  // Metadata
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    // Identity
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 150,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    sex: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    fitnessGoal: {
      type: String,
      enum: ["Lose Weight", "Maintain Weight", "Gain Muscle"],
      required: true,
    },

    // Metrics
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    weightUnit: {
      type: String,
      enum: ["kg", "lbs"],
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ["Sedentary", "Light", "Moderate", "Very Active"],
      required: true,
    },

    // Health
    allergies: {
      type: [String],
      default: [],
    },
    healthConditions: {
      type: [String],
      default: [],
    },

    // Palate
    spiceLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    frequentMeal: {
      type: String,
      required: true,
      trim: true,
    },
    bestFood: {
      type: String,
      required: true,
      trim: true,
    },
    worstFood: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

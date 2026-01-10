import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";
import { Resend } from "resend";

export const runtime = "nodejs";

// const OnboardingSchema = z.object({
//   name: z.string().min(1, "Name is required").max(100),
//   email: z.string().email("Invalid email address"),
//   age: z.number().int().min(1).max(150),
//   sex: z.enum(["Male", "Female", "Other"]),
//   weight: z.number().positive("Weight must be positive"),
//   weightUnit: z.enum(["kg", "lbs"]),
//   activityLevel: z.enum(["Sedentary", "Light", "Moderate", "Very Active"]),
//   allergies: z.array(z.string()).default([]),
//   healthConditions: z.array(z.string()).default([]),
//   spiceLevel: z.number().int().min(1).max(4),
//   frequentMeal: z.string().min(1).max(200),
//   bestFood: z.string().min(1).max(200),
//   worstFood: z.string().min(1).max(200),
// });

const OnboardingSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),

  age: z.coerce.number().int().min(1).max(150),

  sex: z.enum(["Male", "Female", "Other"]),

  weight: z.coerce.number().positive(),
  weightUnit: z.enum(["kg", "lbs"]),

  activityLevel: z.enum(["Sedentary", "Light", "Moderate", "Very Active"]),

  allergies: z.array(z.string()).optional().default([]),
  healthConditions: z.array(z.string()).optional().default([]),

  spiceLevel: z.coerce.number().int().min(1).max(4),

  frequentMeal: z.string().min(1).max(200),
  bestFood: z.string().min(1).max(200),
  worstFood: z.string().min(1).max(200),
  phone: z.string().min(0).max(20).optional(),
  address: z.string().min(0).max(200).optional(),
  fitnessGoal: z.enum(["Lose Weight", "Maintain Weight", "Gain Muscle"]),
});

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = OnboardingSchema.parse(body);

    await connectDB();
    console.log("Connected to database");

    const user = new User(validatedData);
    await user.save();

    console.log("New user onboarded:", user);

    try {
      await resend.emails.send({
        from: "Terraplie <notifications@terraplie.com>",
        to: "ologehelvis@gmail.com",
        bcc: ["admin@terraplie.com"],
        subject: "A new user has onboarded!",
        html: `<p>A new user has just completed the onboarding process.</p>
               <ul>
                 <li><strong>Name:</strong> ${validatedData.name}</li>
                 <li><strong>Email:</strong> ${validatedData.email}</li>
                 <li><strong>Phone:</strong> ${
                   validatedData.phone || "Not provided"
                 }</li>
                 <li><strong>Address:</strong> ${
                   validatedData.address || "Not provided"
                 }</li>
                 <li><strong>Age:</strong> ${validatedData.age}</li>
                  <li><strong>Sex:</strong> ${validatedData.sex}</li>
                  <li><strong>Weight:</strong> ${validatedData.weight} ${
          validatedData.weightUnit
        }</li>
                  <li><strong>Activity Level:</strong> ${
                    validatedData.activityLevel
                  }</li>
                  <li><strong>Fitness Goal:</strong> ${
                    validatedData.fitnessGoal
                  }</li>
                  <li><strong>Allergies:</strong> ${
                    validatedData.allergies.join(", ") || "None"
                  }</li>
                  <li><strong>Health Conditions:</strong> ${
                    validatedData.healthConditions.join(", ") || "None"
                  }</li>
                  <li><strong>Spice Level:</strong> ${
                    validatedData.spiceLevel
                  }</li>
                  <li><strong>Frequent Meal:</strong> ${
                    validatedData.frequentMeal
                  }</li>
                  <li><strong>Best Food:</strong> ${validatedData.bestFood}</li>
                  <li><strong>Worst Food:</strong> ${
                    validatedData.worstFood
                  }</li>

               </ul>`,
      });
    } catch (error) {
      console.log("Failed to send onboarding email notification.", error);
    }

    return NextResponse.json(
      {
        success: true,
        message: "User onboarded successfully",
        userId: user._id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          error: error.message,
        },
        { status: 400 }
      );
    }

    console.error("Onboarding error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to onboard user",
      },
      { status: 500 }
    );
  }
}

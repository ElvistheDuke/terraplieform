import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { COOKIE_NAME, verifySession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;
  if (!secret || !(await verifySession(cookieValue, secret))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const users = await User.find().sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

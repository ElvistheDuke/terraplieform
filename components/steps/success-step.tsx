"use client";

import { Check } from "lucide-react";
import { colors } from "@/lib/colors";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessStep() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl"
        style={{ backgroundColor: colors.sage }}
      >
        <Check size={32} />
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: colors.slate }}>
          Welcome to Terraplie!
        </h2>
        <p className="text-gray-600 text-lg">
          Your wellness journey starts now. We're excited to have you on board!
        </p>
      </div>

      <p className="text-gray-500 max-w-md">
        Your profile has been created. We'll use this information to provide
        personalized nutrition and wellness recommendations just for you.
      </p>
    </div>
  );
}

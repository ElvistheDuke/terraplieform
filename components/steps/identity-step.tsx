"use client";

import type { FormData } from "../onboarding-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { colors } from "@/lib/colors";

interface IdentityStepProps {
  data: FormData;
  onUpdate: (updates: Partial<FormData>) => void;
}

export default function IdentityStep({ data, onUpdate }: IdentityStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: colors.slate }}>
          Let&apos;s Meet You
        </h2>
        <p className="text-gray-600">Help us understand who you are</p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base font-medium">
          What&apos;s your name?
        </Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="John Doe"
          className="text-lg py-6"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-base font-medium">
          What&apos;s your email?
        </Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => onUpdate({ email: e.target.value })}
          placeholder="john@example.com"
          className="text-lg py-6"
        />
      </div>

      {/* Age */}
      <div className="space-y-2">
        <Label htmlFor="age" className="text-base font-medium">
          How old are you?
        </Label>
        <Input
          id="age"
          type="number"
          value={data.age}
          onChange={(e) =>
            onUpdate({ age: e.target.value ? Number(e.target.value) : "" })
          }
          placeholder="25"
          className="text-lg py-6"
          min="1"
          max="150"
        />
      </div>

      {/* Sex */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          What&apos;s your biological sex?
        </Label>
        <div className="flex gap-3">
          {(["Male", "Female", "Other"] as const).map((option) => (
            <Button
              key={option}
              variant={data.sex === option ? "default" : "outline"}
              onClick={() => onUpdate({ sex: option })}
              className={`flex-1 py-6 text-base font-medium ${
                data.sex === option ? "text-white" : ""
              }`}
              style={
                data.sex === option
                  ? { backgroundColor: colors.sage }
                  : { borderColor: colors.border }
              }
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

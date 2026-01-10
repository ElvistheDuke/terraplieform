"use client";

import type { FormData } from "../onboarding-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { colors } from "@/lib/colors";

interface MetricsStepProps {
  data: FormData;
  onUpdate: (updates: Partial<FormData>) => void;
}

export default function MetricsStep({ data, onUpdate }: MetricsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: colors.slate }}>
          Your Metrics
        </h2>
        <p className="text-gray-600">Help us tailor your experience</p>
      </div>

      {/* Weight */}
      <div className="space-y-2">
        <Label className="text-base font-medium">What's your weight?</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={data.weight}
            onChange={(e) =>
              onUpdate({ weight: e.target.value ? Number(e.target.value) : "" })
            }
            placeholder="70"
            className="flex-1 text-lg py-6"
            min="0"
          />
          <div className="flex gap-1 items-center">
            {(["kg", "lbs"] as const).map((unit) => (
              <Button
                key={unit}
                variant={data.weightUnit === unit ? "default" : "outline"}
                onClick={() => onUpdate({ weightUnit: unit })}
                className="px-4 py-6 font-medium"
                style={
                  data.weightUnit === unit
                    ? { backgroundColor: colors.sage }
                    : { borderColor: colors.border }
                }
              >
                {unit.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Level */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          What's your activity level?
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {(["Sedentary", "Light", "Moderate", "Very Active"] as const).map(
            (level) => (
              <Button
                key={level}
                variant={data.activityLevel === level ? "default" : "outline"}
                onClick={() => onUpdate({ activityLevel: level })}
                className="py-6 text-base font-medium text-left"
                style={
                  data.activityLevel === level
                    ? { backgroundColor: colors.sage }
                    : { borderColor: colors.border }
                }
              >
                {level}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Fitness Goal */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          What's your fitness goal?
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(["Lose Weight", "Maintain Weight", "Gain Muscle"] as const).map(
            (goal) => (
              <Button
                key={goal}
                variant={data.fitnessGoal === goal ? "default" : "outline"}
                onClick={() => onUpdate({ fitnessGoal: goal })}
                className="py-6 text-base font-medium text-left"
                style={
                  data.fitnessGoal === goal
                    ? { backgroundColor: colors.sage }
                    : { borderColor: colors.border }
                }
              >
                {goal}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

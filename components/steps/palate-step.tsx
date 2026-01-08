"use client"

import type { FormData } from "../onboarding-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { colors } from "@/lib/colors"

interface PalateStepProps {
  data: FormData
  onUpdate: (updates: Partial<FormData>) => void
}

export default function PalateStep({ data, onUpdate }: PalateStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: colors.slate }}>
          Your Palate
        </h2>
        <p className="text-gray-600">Help us understand your food preferences</p>
      </div>

      {/* Spice Level */}
      <div className="space-y-3">
        <Label className="text-base font-medium">How do you like your spice level?</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((level) => (
            <Button
              key={level}
              variant={data.spiceLevel === level ? "default" : "outline"}
              onClick={() => onUpdate({ spiceLevel: level })}
              className="flex-1 py-6 text-xl font-bold"
              style={data.spiceLevel === level ? { backgroundColor: colors.sage } : { borderColor: colors.border }}
            >
              {"🌶️".repeat(level)}
            </Button>
          ))}
        </div>
      </div>

      {/* Frequent Meal */}
      <div className="space-y-2">
        <Label htmlFor="frequent" className="text-base font-medium">
          What's a meal you eat frequently?
        </Label>
        <Input
          id="frequent"
          value={data.frequentMeal}
          onChange={(e) => onUpdate({ frequentMeal: e.target.value })}
          placeholder="e.g., Pasta with marinara"
          className="text-lg py-6"
        />
      </div>

      {/* Best Food */}
      <div className="space-y-2">
        <Label htmlFor="best" className="text-base font-medium">
          What's your favorite food?
        </Label>
        <Input
          id="best"
          value={data.bestFood}
          onChange={(e) => onUpdate({ bestFood: e.target.value })}
          placeholder="e.g., Sushi"
          className="text-lg py-6"
        />
      </div>

      {/* Worst Food */}
      <div className="space-y-2">
        <Label htmlFor="worst" className="text-base font-medium">
          What food would you rather avoid?
        </Label>
        <Input
          id="worst"
          value={data.worstFood}
          onChange={(e) => onUpdate({ worstFood: e.target.value })}
          placeholder="e.g., Cilantro"
          className="text-lg py-6"
        />
      </div>
    </div>
  )
}

"use client";

import type { FormData } from "../onboarding-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { colors } from "@/lib/colors";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface HealthStepProps {
  data: FormData;
  onUpdate: (updates: Partial<FormData>) => void;
}

const COMMON_ALLERGIES = [
  "Peanuts",
  "Tree Nuts",
  "Milk",
  "Eggs",
  "Fish",
  "Shellfish",
  "Soy",
  "Wheat",
  "Sesame",
  "Mustard",
];

const COMMON_CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "High Cholesterol",
  "IBS",
  "Celiac Disease",
  "Lactose Intolerance",
  "PCOS",
  "Thyroid Issues",
];

export default function HealthStep({ data, onUpdate }: HealthStepProps) {
  const [allergyInput, setAllergyInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");

  const addAllergy = (allergy: string) => {
    if (!data.allergies.includes(allergy)) {
      onUpdate({ allergies: [...data.allergies, allergy] });
    }
    setAllergyInput("");
  };

  const removeAllergy = (allergy: string) => {
    onUpdate({ allergies: data.allergies.filter((a) => a !== allergy) });
  };

  const addCondition = (condition: string) => {
    if (!data.healthConditions.includes(condition)) {
      onUpdate({ healthConditions: [...data.healthConditions, condition] });
    }
    setConditionInput("");
  };

  const removeCondition = (condition: string) => {
    onUpdate({
      healthConditions: data.healthConditions.filter((c) => c !== condition),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: colors.slate }}>
          Health Profile
        </h2>
        <p className="text-gray-600">
          Tell us about any allergies or conditions
        </p>
      </div>

      {/* Allergies */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Do you have any allergies?
        </Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.allergies.map((allergy) => (
            <div
              key={allergy}
              className="flex items-center gap-2 px-3 py-2 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: colors.sage }}
            >
              {allergy}
              <button
                onClick={() => removeAllergy(allergy)}
                className="hover:opacity-80"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {COMMON_ALLERGIES.map((allergy) => (
            <Button
              key={allergy}
              variant="outline"
              onClick={() => addAllergy(allergy)}
              disabled={data.allergies.includes(allergy)}
              className="text-sm"
              style={{ borderColor: colors.border }}
            >
              + {allergy}
            </Button>
          ))}
        </div>
        <Input
          value={allergyInput}
          onChange={(e) => setAllergyInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && allergyInput.trim()) {
              addAllergy(allergyInput.trim());
            }
          }}
          placeholder="Type custom allergy and press Enter"
          className="text-sm"
        />
      </div>

      {/* Health Conditions */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Any health conditions?</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.healthConditions.map((condition) => (
            <div
              key={condition}
              className="flex items-center gap-2 px-3 py-2 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: colors.sage }}
            >
              {condition}
              <button
                onClick={() => removeCondition(condition)}
                className="hover:opacity-80"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {COMMON_CONDITIONS.map((condition) => (
            <Button
              key={condition}
              variant="outline"
              onClick={() => addCondition(condition)}
              disabled={data.healthConditions.includes(condition)}
              className="text-sm"
              style={{ borderColor: colors.border }}
            >
              + {condition}
            </Button>
          ))}
        </div>
        <Input
          value={conditionInput}
          onChange={(e) => setConditionInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && conditionInput.trim()) {
              addCondition(conditionInput.trim());
            }
          }}
          placeholder="Type custom condition and press Enter"
          className="text-sm"
        />
      </div>
    </div>
  );
}

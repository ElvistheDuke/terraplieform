"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import IdentityStep from "./steps/identity-step";
import MetricsStep from "./steps/metrics-step";
import HealthStep from "./steps/health-step";
import PalateStep from "./steps/palate-step";
import SuccessStep from "./steps/success-step";
import { colors } from "@/lib/colors";

export interface FormData {
  // Identity
  name: string;
  email: string;
  phone: string;
  address: string;
  fitnessGoal: "Lose Weight" | "Maintain Weight" | "Gain Muscle" | "";
  age: number | "";
  sex: "Male" | "Female" | "Other" | "";

  // Metrics
  weight: number | "";
  weightUnit: "kg" | "lbs";
  activityLevel: "Sedentary" | "Light" | "Moderate" | "Very Active" | "";

  // Health
  allergies: string[];
  healthConditions: string[];

  // Palate
  spiceLevel: number | "";
  frequentMeal: string;
  bestFood: string;
  worstFood: string;
}

const TOTAL_STEPS = 5; // 4 steps + 1 success

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    age: "",
    phone: "",
    address: "",
    fitnessGoal: "",
    sex: "",
    weight: "",
    weightUnit: "kg",
    activityLevel: "",
    allergies: [],
    healthConditions: [],
    spiceLevel: "",
    frequentMeal: "",
    bestFood: "",
    worstFood: "",
  });

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0: // Identity
        return !!(
          formData.name &&
          formData.age &&
          formData.sex &&
          formData.email &&
          formData.phone &&
          formData.address
        );
      case 1: // Metrics
        return !!(
          formData.weight &&
          formData.activityLevel &&
          formData.fitnessGoal
        );
      case 2: // Health
        return true; // Optional step
      case 3: // Palate
        return !!(
          formData.spiceLevel &&
          formData.frequentMeal &&
          formData.bestFood &&
          formData.worstFood
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) {
      toast.error("Please complete all required fields");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    if (!isStepValid()) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      let body = {
        name: formData.name,
        email: formData.email,
        age: Number(formData.age),
        sex: formData.sex,
        weight: Number(formData.weight),
        weightUnit: formData.weightUnit,
        activityLevel: formData.activityLevel,
        allergies: formData.allergies,
        healthConditions: formData.healthConditions,
        spiceLevel: Number(formData.spiceLevel),
        frequentMeal: formData.frequentMeal,
        bestFood: formData.bestFood,
        worstFood: formData.worstFood,
        phone: formData.phone,
        address: formData.address,
        fitnessGoal: formData.fitnessGoal,
      };

      console.log("Submitting form data:", body);

      const response = await fetch("/api/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to submit form");
      }

      setCurrentStep(4); // Go to success step
      toast.success("Welcome to Terraplie!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const stepComponents = [
    <IdentityStep key="identity" data={formData} onUpdate={updateFormData} />,
    <MetricsStep key="metrics" data={formData} onUpdate={updateFormData} />,
    <HealthStep key="health" data={formData} onUpdate={updateFormData} />,
    <PalateStep key="palate" data={formData} onUpdate={updateFormData} />,
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: colors.lightBg }}
    >
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: colors.slate }}
          >
            Terraplie
          </h1>
          <p className="text-gray-600">Your Wellness Journey Starts Here</p>
        </div>

        {/* Progress Bar */}
        {currentStep < 4 && (
          <div className="mb-8">
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm text-gray-500 mt-2">
              Step {currentStep + 1} of 4
            </p>
          </div>
        )}

        {/* Form Content */}
        <div
          className="rounded-2xl shadow-lg p-8 mb-8"
          style={{ backgroundColor: colors.cream }}
        >
          <AnimatePresence mode="wait">
            {currentStep < 4 ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {stepComponents[currentStep]}
              </motion.div>
            ) : (
              <SuccessStep />
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex gap-4 justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Back
            </Button>

            <div className="flex gap-3">
              {currentStep === 3 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isStepValid()}
                  style={{
                    backgroundColor: colors.sage,
                  }}
                  className="text-white"
                >
                  {isSubmitting ? "Submitting..." : "Complete"}
                </Button>
              ) : (
                <>
                  {/* <Button variant="ghost" onClick={() => setCurrentStep(3)}>
                    Skip to End
                  </Button> */}
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    style={{
                      backgroundColor: colors.sage,
                    }}
                    className="text-white"
                  >
                    Next
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Encouraging Copy */}
        {currentStep < 3 && (
          <div className="text-center mt-6 text-sm text-gray-600">
            {currentStep === 0 && "Let's start with the basics!"}
            {currentStep === 1 && "Almost there! Tell us about your lifestyle."}
            {currentStep === 2 && "We're here to support your health goals."}
          </div>
        )}
      </div>
    </div>
  );
}

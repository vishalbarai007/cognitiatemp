import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dumbbell, ChevronRight, Info } from "lucide-react";

interface ExerciseSidebarProps {
  onExerciseSelect?: (exercise: string) => void;
  onRepCountChange?: (count: number) => void;
  onConfidenceChange?: (confidence: number) => void;
  onStart?: () => void;
  selectedExercise?: string;
  repCount?: number;
  confidenceThreshold?: number;
  isExerciseActive?: boolean;
}

const ExerciseSidebar = ({
  onExerciseSelect = () => {},
  onRepCountChange = () => {},
  onConfidenceChange = () => {},
  onStart = () => {},
  selectedExercise = "Push-ups",
  repCount = 10,
  confidenceThreshold = 0.7,
  isExerciseActive = false,
}: ExerciseSidebarProps) => {
  const [exercise, setExercise] = useState(selectedExercise);
  const [reps, setReps] = useState(repCount);
  const [confidence, setConfidence] = useState(confidenceThreshold);

  const exercises = [
    "Push-ups",
    "Squats",
    "Jumping Jacks",
    "Sit-ups",
    "Lunges",
  ];

  const handleExerciseSelect = (ex: string) => {
    setExercise(ex);
    onExerciseSelect(ex);
  };

  const handleRepChange = (value: number[]) => {
    const newValue = value[0];
    setReps(newValue);
    onRepCountChange(newValue);
  };

  const handleConfidenceChange = (value: number[]) => {
    const newValue = value[0];
    setConfidence(newValue);
    onConfidenceChange(newValue);
  };

  const handleStart = () => {
    onStart();
  };

  const getExerciseDescription = (ex: string) => {
    switch (ex) {
      case "Push-ups":
        return [
          "Keep your body straight",
          "Arms shoulder-width apart",
          "Lower until elbows are at 90°",
          "Push back up with controlled movement",
        ];
      case "Squats":
        return [
          "Feet shoulder-width apart",
          "Keep chest up, back straight",
          "Lower until thighs are parallel to ground",
          "Push through heels to stand",
        ];
      case "Jumping Jacks":
        return [
          "Start with feet together, arms at sides",
          "Jump and spread legs while raising arms",
          "Return to starting position",
          "Maintain rhythm and form",
        ];
      case "Sit-ups":
        return [
          "Lie on back, knees bent at 45°",
          "Hands across chest or beside head",
          "Engage core to raise upper body",
          "Lower with control",
        ];
      case "Lunges":
        return [
          "Stand with feet hip-width apart",
          "Step forward with one leg",
          "Lower until both knees at 90°",
          "Push back to starting position",
          "Alternate legs",
        ];
      default:
        return [];
    }
  };

  return (
    <div className="h-full w-full max-w-[320px] bg-[rgb(32,33,39)] text-white p-4 flex flex-col">
      <div className="flex items-center mb-6">
        <Dumbbell className="h-6 w-6 mr-2 text-[rgb(24,239,199)]" />
        <h2 className="text-xl font-bold">Exercise Settings</h2>
      </div>

      <Card className="bg-[rgb(40,41,47)] border-none mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[rgb(24,239,199)]">
            Select Exercise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {exercises.map((ex) => (
              <Button
                key={ex}
                variant={exercise === ex ? "default" : "outline"}
                className={`w-full justify-between ${exercise === ex ? "bg-[rgb(24,239,199)] text-[rgb(32,33,39)]" : "bg-transparent hover:bg-[rgba(24,239,199,0.1)] text-white"}`}
                onClick={() => handleExerciseSelect(ex)}
              >
                {ex}
                {exercise === ex && <ChevronRight className="h-4 w-4 ml-2" />}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[rgb(40,41,47)] border-none mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[rgb(24,239,199)]">
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="rep-count">Repetition Count</Label>
              <span className="text-[rgb(24,239,199)]">{reps}</span>
            </div>
            <Slider
              id="rep-count"
              min={5}
              max={30}
              step={5}
              value={[reps]}
              onValueChange={handleRepChange}
              className="[&>[data-orientation=horizontal]>.bg-primary]:bg-[rgb(24,239,199)]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="confidence">Detection Confidence</Label>
              <span className="text-[rgb(24,239,199)]">
                {confidence.toFixed(1)}
              </span>
            </div>
            <Slider
              id="confidence"
              min={0.5}
              max={0.9}
              step={0.1}
              value={[confidence]}
              onValueChange={handleConfidenceChange}
              className="[&>[data-orientation=horizontal]>.bg-primary]:bg-[rgb(24,239,199)]"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        className="bg-[rgb(24,239,199)] text-[rgb(32,33,39)] hover:bg-[rgb(24,239,199)]/90 mb-6"
        size="lg"
        onClick={handleStart}
        disabled={isExerciseActive}
      >
        {isExerciseActive ? "Exercise in Progress" : "Start Exercise"}
      </Button>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="exercise-info" className="border-[rgb(60,61,67)]">
          <AccordionTrigger className="text-[rgb(24,239,199)] hover:text-[rgb(24,239,199)]/90">
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Exercise Information
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mt-2 space-y-2 text-sm">
              {getExerciseDescription(exercise).map((desc, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-[rgb(24,239,199)] mr-2">•</span>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="joint-reference"
          className="border-[rgb(60,61,67)]"
        >
          <AccordionTrigger className="text-[rgb(24,239,199)] hover:text-[rgb(24,239,199)]/90">
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Joint ID Reference
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex items-start">
                <span className="text-[rgb(24,239,199)] mr-2">•</span>
                <p>11/12: Shoulders</p>
              </div>
              <div className="flex items-start">
                <span className="text-[rgb(24,239,199)] mr-2">•</span>
                <p>13/14: Elbows</p>
              </div>
              <div className="flex items-start">
                <span className="text-[rgb(24,239,199)] mr-2">•</span>
                <p>15/16: Wrists</p>
              </div>
              <div className="flex items-start">
                <span className="text-[rgb(24,239,199)] mr-2">•</span>
                <p>23/24: Hips</p>
              </div>
              <div className="flex items-start">
                <span className="text-[rgb(24,239,199)] mr-2">•</span>
                <p>25/26: Knees</p>
              </div>
              <div className="flex items-start">
                <span className="text-[rgb(24,239,199)] mr-2">•</span>
                <p>27/28: Ankles</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-auto pt-4">
        <Separator className="bg-[rgb(60,61,67)]" />
        <p className="text-xs text-gray-400 mt-4 text-center">
          AI Fitness Trainer v1.0
          <br />
          Powered by Computer Vision
        </p>
      </div>
    </div>
  );
};

export default ExerciseSidebar;
